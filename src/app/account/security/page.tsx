import { unstable_noStore as noStore } from "next/cache";

import { SecurityPageClient } from "@/components/auth/SecurityPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Security",
  description: "Review current protection and linked sign-in methods for Metis.",
});

type SecurityPageProps = {
  searchParams?: Promise<{
    auth?: string;
    intent?: string;
  }>;
};

export default async function SecurityPage({ searchParams }: SecurityPageProps) {
  noStore();
  const params = searchParams ? await searchParams : undefined;
  const user = await requireAuthenticatedUser();

  return (
    <SecurityPageClient
      email={user.email}
      provider={user.provider}
      username={user.username}
      authConfirmed={params?.auth === "confirmed"}
      initialDeleteOpen={params?.intent === "delete-account"}
    />
  );
}
