import { SecurityPageClient } from "@/components/auth/SecurityPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Security",
  description: "Review current protection and staged two-factor security for Metis.",
});

export default async function SecurityPage() {
  const user = await requireAuthenticatedUser();

  return <SecurityPageClient email={user.email} provider={user.provider} />;
}
