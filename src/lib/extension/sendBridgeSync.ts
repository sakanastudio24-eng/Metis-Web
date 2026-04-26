import { getWebEnv } from "@/lib/env";
import type { BridgeAccountState } from "@/lib/contracts/communication";
import { isAllowedBridgeOrigin } from "@/lib/contracts/communication";
import {
  METIS_BRIDGE_DISCONNECT_TYPE,
  METIS_BRIDGE_SYNC_TYPE,
  METIS_EXTERNAL_BRIDGE_VERSION,
  METIS_EXTENSION_ID_QUERY_PARAM,
  METIS_LAST_EXTENSION_ID_KEY,
  isBridgeSyncAck,
  isBridgeSyncFailure,
  type MetisBridgeDisconnectMessage,
  type MetisBridgeSyncAck,
  type MetisBridgeSyncFailure,
  type MetisBridgeSyncMessage,
} from "@/lib/contracts/extension-bridge";

type SendBridgeSyncOptions = {
  account: BridgeAccountState;
  queryExtensionId?: string | null;
};

export type BridgeSendStage =
  | "origin_check"
  | "config_check"
  | "candidate_selection"
  | "runtime_send"
  | "extension_response";

export type BridgeSyncDebugInfo = {
  currentOrigin: string | null;
  currentPath: string | null;
  queryExtensionId: string | null;
  configuredExtensionIds: string[];
  candidateExtensionIds: string[];
  attemptedExtensionId: string | null;
  stage: BridgeSendStage;
  detail: string;
};

export type BridgeSyncResult = (MetisBridgeSyncAck | MetisBridgeSyncFailure) & {
  debug: BridgeSyncDebugInfo;
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

function withDebug<T extends MetisBridgeSyncAck | MetisBridgeSyncFailure>(
  response: T,
  debug: BridgeSyncDebugInfo
): BridgeSyncResult {
  return {
    ...response,
    debug,
  };
}

function sendMessageToExtension(
  extensionId: string,
  message: MetisBridgeSyncMessage | MetisBridgeDisconnectMessage,
  debugBase: Omit<BridgeSyncDebugInfo, "attemptedExtensionId" | "stage" | "detail">
): Promise<BridgeSyncResult> {
  const runtime = getChromeRuntime();
  const sendDebug = {
    ...debugBase,
    attemptedExtensionId: extensionId,
    stage: "runtime_send" as const,
  };

  if (!runtime?.sendMessage) {
    return Promise.resolve(
      withDebug(
        buildFailure(
          "extension_unavailable",
          "chrome.runtime.sendMessage is not available on this page. Open the Metis website in Chrome with the extension installed."
        ),
        {
          ...sendDebug,
          detail: "chrome.runtime.sendMessage is unavailable in this browser context.",
        }
      )
    );
  }

  console.info("[Metis bridge] sending account sync to extension", {
    extensionId,
    origin: debugBase.currentOrigin,
    path: debugBase.currentPath,
    queryExtensionId: debugBase.queryExtensionId,
  });

  return new Promise((resolve) => {
    runtime.sendMessage?.(extensionId, message, (response) => {
      const runtimeError = runtime.lastError;

      if (runtimeError?.message) {
        resolve(
          withDebug(
            buildFailure(
              "extension_unavailable",
              `The website targeted extension ${extensionId}, but Chrome could not deliver the connection request. ${runtimeError.message}`
            ),
            {
              ...sendDebug,
              detail: runtimeError.message,
            }
          )
        );
        return;
      }

      if (isBridgeSyncAck(response)) {
        storeExtensionId(extensionId);
        resolve(
          withDebug(response, {
            ...sendDebug,
            stage: "extension_response",
            detail: `Extension ${extensionId} acknowledged and stored the account snapshot.`,
          })
        );
        return;
      }

      if (isBridgeSyncFailure(response)) {
        resolve(
          withDebug(response, {
            ...sendDebug,
            stage: "extension_response",
            detail: response.detail ?? `Extension ${extensionId} rejected the bridge request.`,
          })
        );
        return;
      }

      resolve(
        withDebug(
          buildFailure(
            "unknown",
            `Extension ${extensionId} returned an unexpected bridge response.`
          ),
          {
            ...sendDebug,
            stage: "extension_response",
            detail: `Extension ${extensionId} returned an unexpected bridge response.`,
          }
        )
      );
    });
  });
}

export async function sendBridgeSync({
  account,
  queryExtensionId,
}: SendBridgeSyncOptions): Promise<BridgeSyncResult> {
  if (typeof window === "undefined") {
    return withDebug(
      buildFailure("unknown", "Bridge sync can only run in the browser."),
      {
        currentOrigin: null,
        currentPath: null,
        queryExtensionId: queryExtensionId ?? null,
        configuredExtensionIds: [],
        candidateExtensionIds: [],
        attemptedExtensionId: null,
        stage: "origin_check",
        detail: "Bridge sync was called outside the browser.",
      }
    );
  }

  const currentOrigin = window.location.origin;
  const currentPath = `${window.location.pathname}${window.location.search}`;

  if (!isAllowedBridgeOrigin(window.location.origin)) {
    return withDebug(
      buildFailure(
        "invalid_origin",
        `Bridge sync is only allowed from metis.zward.studio or localhost. Current origin: ${window.location.origin}.`
      ),
      {
        currentOrigin,
        currentPath,
        queryExtensionId: queryExtensionId ?? null,
        configuredExtensionIds: [],
        candidateExtensionIds: [],
        attemptedExtensionId: null,
        stage: "origin_check",
        detail: `Origin ${window.location.origin} is not allowed for the bridge.`,
      }
    );
  }

  const configuredIds = getConfiguredExtensionIds();
  const candidates = buildCandidateExtensionIds(configuredIds, queryExtensionId);
  const debugBase = {
    currentOrigin,
    currentPath,
    queryExtensionId: queryExtensionId ?? null,
    configuredExtensionIds: configuredIds,
  };

  if (!Array.isArray(candidates)) {
    return withDebug(candidates, {
      ...debugBase,
      candidateExtensionIds: [],
      attemptedExtensionId: null,
      stage: "config_check",
      detail: candidates.detail ?? "No valid extension IDs were available for the bridge.",
    });
  }

  const message: MetisBridgeSyncMessage = {
    type: METIS_BRIDGE_SYNC_TYPE,
    source: "metis-web",
    bridgeVersion: METIS_EXTERNAL_BRIDGE_VERSION,
    account,
  };

  let lastFailure: MetisBridgeSyncFailure | null = null;

  for (const extensionId of candidates) {
    const response = await sendMessageToExtension(extensionId, message, {
      ...debugBase,
      candidateExtensionIds: candidates,
    });

    if (isBridgeSyncAck(response)) {
      return response;
    }

    lastFailure = response;

    if (response.reason !== "invalid_extension_id") {
      return response;
    }
  }

  return (
    (lastFailure
      ? withDebug(lastFailure, {
          ...debugBase,
          candidateExtensionIds: candidates,
          attemptedExtensionId: null,
          stage: "candidate_selection",
          detail: lastFailure.detail ?? "The website exhausted the allowlisted extension IDs without a response.",
        })
      : withDebug(
          buildFailure(
            "extension_unavailable",
            "The website could not find a responding allowlisted Metis extension. Verify the published extension ID is configured on the website and the extension is installed in this Chrome profile."
          ),
          {
            ...debugBase,
            candidateExtensionIds: candidates,
            attemptedExtensionId: null,
            stage: "candidate_selection",
            detail: "The website exhausted the allowlisted extension IDs without a response.",
          }
        ))
  );
}

export async function sendBridgeDisconnect(queryExtensionId?: string | null): Promise<BridgeSyncResult> {
  if (typeof window === "undefined") {
    return withDebug(
      buildFailure("unknown", "Bridge disconnect can only run in the browser."),
      {
        currentOrigin: null,
        currentPath: null,
        queryExtensionId: queryExtensionId ?? null,
        configuredExtensionIds: [],
        candidateExtensionIds: [],
        attemptedExtensionId: null,
        stage: "origin_check",
        detail: "Bridge disconnect was called outside the browser.",
      }
    );
  }

  const currentOrigin = window.location.origin;
  const currentPath = `${window.location.pathname}${window.location.search}`;

  if (!isAllowedBridgeOrigin(currentOrigin)) {
    return withDebug(
      buildFailure("invalid_origin", `Bridge disconnect is not allowed from ${currentOrigin}.`),
      {
        currentOrigin,
        currentPath,
        queryExtensionId: queryExtensionId ?? null,
        configuredExtensionIds: [],
        candidateExtensionIds: [],
        attemptedExtensionId: null,
        stage: "origin_check",
        detail: `Origin ${currentOrigin} is not allowed for the bridge.`,
      }
    );
  }

  const configuredIds = getConfiguredExtensionIds();
  const candidates = buildCandidateExtensionIds(configuredIds, queryExtensionId);
  const debugBase = {
    currentOrigin,
    currentPath,
    queryExtensionId: queryExtensionId ?? null,
    configuredExtensionIds: configuredIds,
  };

  if (!Array.isArray(candidates)) {
    return withDebug(candidates, {
      ...debugBase,
      candidateExtensionIds: [],
      attemptedExtensionId: null,
      stage: "config_check",
      detail: candidates.detail ?? "No valid extension IDs were available for the disconnect bridge.",
    });
  }

  const message: MetisBridgeDisconnectMessage = {
    type: METIS_BRIDGE_DISCONNECT_TYPE,
    source: "metis-web",
    bridgeVersion: METIS_EXTERNAL_BRIDGE_VERSION,
  };

  let lastFailure: MetisBridgeSyncFailure | null = null;

  for (const extensionId of candidates) {
    const response = await sendMessageToExtension(extensionId, message, {
      ...debugBase,
      candidateExtensionIds: candidates,
    });

    if (isBridgeSyncAck(response)) {
      return response;
    }

    lastFailure = response;

    if (response.reason !== "invalid_extension_id") {
      return response;
    }
  }

  return (
    lastFailure
      ? withDebug(lastFailure, {
          ...debugBase,
          candidateExtensionIds: candidates,
          attemptedExtensionId: null,
          stage: "candidate_selection",
          detail: lastFailure.detail ?? "The website exhausted the allowlisted extension IDs without a disconnect response.",
        })
      : withDebug(
          buildFailure(
            "extension_unavailable",
            "The website could not find a responding allowlisted Metis extension to disconnect."
          ),
          {
            ...debugBase,
            candidateExtensionIds: candidates,
            attemptedExtensionId: null,
            stage: "candidate_selection",
            detail: "The website exhausted the allowlisted extension IDs without a disconnect response.",
          }
        )
  );
}
