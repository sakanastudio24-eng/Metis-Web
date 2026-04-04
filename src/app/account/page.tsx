import { unstable_noStore as noStore } from "next/cache";

import { AccountPageClient } from "@/components/auth/AccountPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Metis Dash",
  description: "Review your Metis Dash account, API beta status, security posture, and plan access.",
});

type AccountPageProps = {
  searchParams?: Promise<{
    auth?: string;
    intent?: string;
    section?: string;
  }>;
};

function getInitialSection(value: string | undefined): "account" | "security" | "pricing" | "settings" {
  return value === "security" || value === "pricing" || value === "settings" ? value : "account";
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  noStore();
  const params = searchParams ? await searchParams : undefined;
  const user = await requireAuthenticatedUser();

  return (
    <AccountPageClient
      email={user.email}
      provider={user.provider}
      emailConfirmed={user.emailConfirmed}
      username={user.username}
      initialSection={getInitialSection(params?.section)}
      initialDeleteOpen={params?.intent === "delete-account"}
      authConfirmed={params?.auth === "confirmed"}
    />
  );
}
