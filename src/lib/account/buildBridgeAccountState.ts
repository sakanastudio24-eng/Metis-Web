import type { AccountDashboardSnapshot } from "@/lib/account-data";
import type { BridgeAccountState } from "@/lib/contracts/communication";

export function buildBridgeAccountState(account: AccountDashboardSnapshot): BridgeAccountState {
  return {
    email: account.email,
    username: account.username,
    scansUsed: account.scansUsed,
    tier: account.tier,
    isBeta: account.isBeta,
  };
}
