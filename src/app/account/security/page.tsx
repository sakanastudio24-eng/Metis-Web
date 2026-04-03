import { unstable_noStore as noStore } from "next/cache";

import { SecurityPageClient } from "@/components/auth/SecurityPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Security",
  description: "Review current protection and linked sign-in methods for Metis.",
});

export default async function SecurityPage() {
  noStore();
  const user = await requireAuthenticatedUser();

  return <SecurityPageClient email={user.email} provider={user.provider} username={user.username} />;
}
