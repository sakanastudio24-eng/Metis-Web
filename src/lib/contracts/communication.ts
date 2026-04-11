export const METIS_EXTENSION_SOURCE = "extension";
export const METIS_AUTH_SUCCESS_PATH = "/account/settings";
// Exact-match allowlist only. No wildcard hosts, no sibling subdomains.
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

export type BridgeAccountState = {
  email: string | null;
  username: string | null;
  scansUsed: number;
  tier: MetisPlan;
  isBeta: boolean;
};

export type ExtensionValidateResponse = {
  account: MetisValidatedAccountState;
  bridgeAccount: BridgeAccountState;
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
