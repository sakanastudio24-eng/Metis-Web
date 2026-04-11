import type { BridgeAccountState } from "@/lib/contracts/communication";

export const METIS_EXTERNAL_BRIDGE_VERSION = 1;
export const METIS_BRIDGE_SYNC_TYPE = "METIS_BRIDGE_SYNC";
export const METIS_BRIDGE_SYNC_ACK_TYPE = "METIS_BRIDGE_SYNC_ACK";
export const METIS_BRIDGE_SYNC_FAILURE_TYPE = "METIS_BRIDGE_SYNC_FAILURE";
export const METIS_EXTENSION_ID_QUERY_PARAM = "extensionId";
export const METIS_LAST_EXTENSION_ID_KEY = "metis:last-extension-id";

export type MetisBridgeSyncMessage = {
  type: typeof METIS_BRIDGE_SYNC_TYPE;
  source: "metis-web";
  bridgeVersion: 1;
  account: BridgeAccountState;
};

export type MetisBridgeSyncAck = {
  type: typeof METIS_BRIDGE_SYNC_ACK_TYPE;
  source: "metis-extension";
  bridgeVersion: 1;
  ok: true;
};

export type MetisBridgeSyncFailureReason =
  | "invalid_origin"
  | "invalid_extension_id"
  | "invalid_message_type"
  | "invalid_payload"
  | "unsupported_bridge_version"
  | "storage_failed"
  | "extension_unavailable"
  | "unknown";

export type MetisBridgeSyncFailure = {
  type: typeof METIS_BRIDGE_SYNC_FAILURE_TYPE;
  source: "metis-extension";
  bridgeVersion: 1;
  ok: false;
  reason: MetisBridgeSyncFailureReason;
  detail?: string;
};

export function isBridgeSyncAck(value: unknown): value is MetisBridgeSyncAck {
  if (!value || typeof value !== "object") {
    return false;
  }

  const ack = value as Partial<MetisBridgeSyncAck>;
  return (
    ack.type === METIS_BRIDGE_SYNC_ACK_TYPE &&
    ack.source === "metis-extension" &&
    ack.bridgeVersion === METIS_EXTERNAL_BRIDGE_VERSION &&
    ack.ok === true
  );
}

export function isBridgeSyncFailure(value: unknown): value is MetisBridgeSyncFailure {
  if (!value || typeof value !== "object") {
    return false;
  }

  const failure = value as Partial<MetisBridgeSyncFailure>;
  return (
    failure.type === METIS_BRIDGE_SYNC_FAILURE_TYPE &&
    failure.source === "metis-extension" &&
    failure.bridgeVersion === METIS_EXTERNAL_BRIDGE_VERSION &&
    failure.ok === false &&
    typeof failure.reason === "string"
  );
}
