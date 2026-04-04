import { unstable_noStore as noStore } from "next/cache";

import { AccountPageClient } from "@/components/auth/AccountPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";

type AccountSection = "account" | "pricing" | "settings";

type AccountSectionPageProps = {
  section: AccountSection;
  auth?: string;
  intent?: string;
};

export async function AccountSectionPage({ section, auth, intent }: AccountSectionPageProps) {
  noStore();
  const user = await requireAuthenticatedUser();

  return (
    <AccountPageClient
      email={user.email}
      provider={user.provider}
      emailConfirmed={user.emailConfirmed}
      username={user.username}
      initialSection={section}
      initialDeleteOpen={intent === "delete-account"}
      authConfirmed={auth === "confirmed"}
    />
  );
}
