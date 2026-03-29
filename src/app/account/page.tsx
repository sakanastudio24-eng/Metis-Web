import { AccountPageClient } from "@/components/auth/AccountPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Account",
  description: "Manage your Metis profile, plan, and account access.",
});

export default async function AccountPage() {
  const user = await requireAuthenticatedUser();

  return (
    <AccountPageClient
      email={user.email}
      provider={user.provider}
      emailConfirmed={user.emailConfirmed}
      isTemporary={user.isTemporary}
    />
  );
}
