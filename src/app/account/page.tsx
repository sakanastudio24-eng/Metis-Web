import { unstable_noStore as noStore } from "next/cache";

import { AccountPageClient } from "@/components/auth/AccountPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Metis Dash",
  description: "Review your Metis Dash account, API beta status, security posture, and plan access.",
});

export default async function AccountPage() {
  noStore();
  const user = await requireAuthenticatedUser();

  return (
    <AccountPageClient
      email={user.email}
      provider={user.provider}
      emailConfirmed={user.emailConfirmed}
      username={user.username}
    />
  );
}
