import { getWebEnv } from "@/lib/env";
import type { BridgeAccountState } from "@/lib/contracts/communication";
import { isAllowedBridgeOrigin } from "@/lib/contracts/communication";
import {
  METIS_BRIDGE_SYNC_TYPE,
  METIS_EXTERNAL_BRIDGE_VERSION,
  METIS_EXTENSION_ID_QUERY_PARAM,
  METIS_LAST_EXTENSION_ID_KEY,
  isBridgeSyncAck,
  isBridgeSyncFailure,
  type MetisBridgeSyncAck,
  type MetisBridgeSyncFailure,
  type MetisBridgeSyncMessage,
} from "@/lib/contracts/extension-bridge";

type SendBridgeSyncOptions = {
  account: BridgeAccountState;
  queryExtensionId?: string | null;
};

type ChromeRuntimeLike = {
  runtime?: {
    lastError?: { message?: string };
    sendMessage?: (
      extensionId: string,
      message: unknown,
      callback?: (response: unknown) => void
    ) => void;
  };
};

function getChromeRuntime() {
  const chromeLike = globalThis as typeof globalThis & { chrome?: ChromeRuntimeLike };
  return chromeLike.chrome?.runtime ?? null;
}

function parseCsvIds(value: string | undefined) {
  return value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];
}

function getConfiguredExtensionIds() {
  const env = getWebEnv();

  return [
    env.NEXT_PUBLIC_METIS_EXTENSION_ID,
    ...parseCsvIds(env.NEXT_PUBLIC_METIS_EXTENSION_DEV_IDS),
  ].filter((value): value is string => Boolean(value));
}

function getStoredExtensionId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(METIS_LAST_EXTENSION_ID_KEY);
}

function clearStoredExtensionId() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(METIS_LAST_EXTENSION_ID_KEY);
}

function storeExtensionId(extensionId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(METIS_LAST_EXTENSION_ID_KEY, extensionId);
}

function buildCandidateExtensionIds(
  configuredIds: string[],
  queryExtensionId?: string | null
): string[] | MetisBridgeSyncFailure {
  if (!configuredIds.length) {
    return buildFailure(
      "invalid_extension_id",
      "No allowed extension IDs are configured on the Metis website yet. Add the production extension ID and any local dev IDs before using the bridge."
    );
  }

  if (queryExtensionId && !configuredIds.includes(queryExtensionId)) {
    return buildFailure(
      "invalid_extension_id",
      `The requested extensionId ${queryExtensionId} is not in the website allowlist. Keep the passed ID as a routing hint only and add it to the configured allowlist first.`
    );
  }

  const candidates = new Set<string>();

  if (queryExtensionId) {
    candidates.add(queryExtensionId);
  }

  const storedExtensionId = getStoredExtensionId();

  if (storedExtensionId && configuredIds.includes(storedExtensionId)) {
    candidates.add(storedExtensionId);
  } else if (storedExtensionId) {
    clearStoredExtensionId();
  }

  for (const extensionId of configuredIds) {
    candidates.add(extensionId);
  }

  return Array.from(candidates);
}

function buildFailure(
  reason: MetisBridgeSyncFailure["reason"],
  detail: string
): MetisBridgeSyncFailure {
  return {
    type: "METIS_BRIDGE_SYNC_FAILURE",
    source: "metis-extension",
    bridgeVersion: METIS_EXTERNAL_BRIDGE_VERSION,
    ok: false,
    reason,
    detail,
  };
}

function sendMessageToExtension(
  extensionId: string,
  message: MetisBridgeSyncMessage
): Promise<MetisBridgeSyncAck | MetisBridgeSyncFailure> {
  const runtime = getChromeRuntime();

  if (!runtime?.sendMessage) {
    return Promise.resolve(
      buildFailure(
        "extension_unavailable",
        "chrome.runtime.sendMessage is not available on this page. Open the Metis website in Chrome with the extension installed."
      )
    );
  }

  return new Promise((resolve) => {
    runtime.sendMessage?.(extensionId, message, (response) => {
      const runtimeError = runtime.lastError;

      if (runtimeError?.message) {
        resolve(
          buildFailure(
            "extension_unavailable",
            `The website targeted extension ${extensionId}, but Chrome could not deliver the connection request. ${runtimeError.message}`
          )
        );
        return;
      }

      if (isBridgeSyncAck(response)) {
        storeExtensionId(extensionId);
        resolve(response);
        return;
      }

      if (isBridgeSyncFailure(response)) {
        resolve(response);
        return;
      }

      resolve(
        buildFailure(
          "unknown",
          `Extension ${extensionId} returned an unexpected bridge response.`
        )
      );
    });
  });
}

export async function sendBridgeSync({
  account,
  queryExtensionId,
}: SendBridgeSyncOptions): Promise<MetisBridgeSyncAck | MetisBridgeSyncFailure> {
  if (typeof window === "undefined") {
    return buildFailure("unknown", "Bridge sync can only run in the browser.");
  }

  if (!isAllowedBridgeOrigin(window.location.origin)) {
    return buildFailure(
      "invalid_origin",
      `Bridge sync is only allowed from metis.zward.studio or localhost. Current origin: ${window.location.origin}.`
    );
  }

  const configuredIds = getConfiguredExtensionIds();
  const candidates = buildCandidateExtensionIds(configuredIds, queryExtensionId);

  if (!Array.isArray(candidates)) {
    return candidates;
  }

  const message: MetisBridgeSyncMessage = {
    type: METIS_BRIDGE_SYNC_TYPE,
    source: "metis-web",
    bridgeVersion: METIS_EXTERNAL_BRIDGE_VERSION,
    account,
  };

  let lastFailure: MetisBridgeSyncFailure | null = null;

  for (const extensionId of candidates) {
    const response = await sendMessageToExtension(extensionId, message);

    if (isBridgeSyncAck(response)) {
      return response;
    }

    lastFailure = response;

    if (response.reason !== "invalid_extension_id") {
      return response;
    }
  }

  return (
    lastFailure ??
    buildFailure(
      "extension_unavailable",
      "The website could not find a responding allowlisted Metis extension. Verify the published extension ID is configured on the website and the extension is installed in this Chrome profile."
    )
  );
}
