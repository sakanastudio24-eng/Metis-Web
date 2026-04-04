import { unstable_noStore as noStore } from "next/cache";

import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { LoggedInState } from "@/components/auth/LoggedInState";
import { LandingPage } from "@/components/landing/LandingPage";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { bootstrapAccountData } from "@/lib/account-data";
import { createPrivateMetadata } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = createPrivateMetadata({
  title: "Setup",
  description: "Complete your first secure Metis setup steps.",
});

export default async function LoggedInPage() {
  noStore();
  const user = await requireAuthenticatedUser();
  const supabase = await createSupabaseServerClient();
  const accountData = await bootstrapAccountData(supabase, user.user);

  if (accountData.profile.onboarding_complete) {
    redirect("/account");
  }

  return (
    <>
      <LandingPage />
      <AuthOverlay>
        <LoggedInState
          email={user.email}
          userId={user.user.id}
          initialAnswers={accountData.onboarding}
        />
      </AuthOverlay>
    </>
  );
}
