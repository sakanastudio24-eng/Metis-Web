export const METIS_EXTENSION_SOURCE = "extension";
export const METIS_AUTH_SUCCESS_PATH = "/auth/success";
// Only the first-party website origins should be allowed to originate the
// bridge payload that the extension accepts.
export const METIS_ALLOWED_BRIDGE_ORIGINS = [
  "https://metis.zward.studio",
  "http://localhost:3000",
] as const;

export type MetisAuthSource = typeof METIS_EXTENSION_SOURCE;
export type MetisPlan = "free" | "plus_beta" | "paid";

export type AccessState = {
  isAuthenticated: boolean;
  tier: MetisPlan;
};

export type MetisValidatedAccountState = {
  plan: MetisPlan;
  plusBetaEnabled: boolean;
  apiBetaEnabled: boolean;
  allowPlusUi: boolean;
  allowReportEmail: boolean;
};

export type MetisAuthSuccessMessage = {
  type: "METIS_AUTH_SUCCESS";
  source: "metis-web";
  version: 1;
  session: {
    accessToken: string;
    expiresAt: number | null;
    user: {
      id: string;
      email: string | null;
    };
  };
};

export type MetisAuthSuccessAck = {
  type: "METIS_AUTH_SUCCESS_ACK";
  source: "metis-extension";
  version: 1;
  ok: true;
};

export type UsageEventPayload = {
  type: string;
  occurredAt: number;
  route?: string;
};

export type ScanSummaryPayload = {
  route: string;
  score: number | null;
  issueCount: number;
  confidence: string | null;
};

export type PremiumReportRequestPayload = {
  route: string;
  requestedAt: number;
  source: "panel" | "report" | "popup";
};

export function isExtensionAuthSource(source: string | null | undefined): source is MetisAuthSource {
  return source === METIS_EXTENSION_SOURCE;
}

export function getAuthSource(source: string | null | undefined): MetisAuthSource | null {
  return isExtensionAuthSource(source) ? METIS_EXTENSION_SOURCE : null;
}

export function isAllowedBridgeOrigin(origin: string): boolean {
  return METIS_ALLOWED_BRIDGE_ORIGINS.includes(origin as (typeof METIS_ALLOWED_BRIDGE_ORIGINS)[number]);
}

export function isMetisAuthSuccessAck(value: unknown): value is MetisAuthSuccessAck {
  if (!value || typeof value !== "object") {
    return false;
  }

  const ack = value as Partial<MetisAuthSuccessAck>;
  return (
    ack.type === "METIS_AUTH_SUCCESS_ACK" &&
    ack.source === "metis-extension" &&
    ack.version === 1 &&
    ack.ok === true
  );
}
