import { unstable_noStore as noStore } from "next/cache";

import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { AccountPageClient } from "@/components/auth/AccountPageClient";
import { AuthSuccessBridge } from "@/components/auth/AuthSuccessBridge";
import { buildBridgeAccountState } from "@/lib/account/buildBridgeAccountState";
import { bootstrapAccountData, getAccountDashboardSnapshot } from "@/lib/account-data";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { getAuthSource } from "@/lib/contracts/communication";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AccountSection = "account" | "pricing" | "settings";

type AccountSectionPageProps = {
  section: AccountSection;
  auth?: string;
  intent?: string;
  source?: string;
  extensionId?: string;
};

export async function AccountSectionPage({ section, auth, intent, source, extensionId }: AccountSectionPageProps) {
  noStore();
  const user = await requireAuthenticatedUser();
  const supabase = await createSupabaseServerClient();
  const accountData = await bootstrapAccountData(supabase, user.user);
  const accountSnapshot = getAccountDashboardSnapshot(accountData);
  const bridgeSource = getAuthSource(source);

  return (
    <>
      <AccountPageClient
        provider={user.provider}
        emailConfirmed={user.emailConfirmed}
        account={accountSnapshot}
        initialSection={section}
        initialDeleteOpen={intent === "delete-account"}
        authConfirmed={auth === "confirmed"}
      />
      {section === "settings" && bridgeSource ? (
        <AuthOverlay closeHref="/account/settings">
          <AuthSuccessBridge
            account={buildBridgeAccountState(accountSnapshot)}
            email={user.email}
            queryExtensionId={extensionId ?? null}
          />
        </AuthOverlay>
      ) : null}
    </>
  );
}
