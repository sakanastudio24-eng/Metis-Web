import { unstable_noStore as noStore } from "next/cache";

import { SecurityPageClient } from "@/components/auth/SecurityPageClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { bootstrapAccountData, getAccountDashboardSnapshot } from "@/lib/account-data";
import { createPrivateMetadata } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = createPrivateMetadata({
  title: "Security",
  description: "Review current protection and linked sign-in methods for Metis.",
});

export default async function SecurityPage() {
  noStore();
  const user = await requireAuthenticatedUser();
  const supabase = await createSupabaseServerClient();
  const accountData = await bootstrapAccountData(supabase, user.user);

  return (
    <SecurityPageClient
      account={getAccountDashboardSnapshot(accountData)}
      provider={user.provider}
    />
  );
}
