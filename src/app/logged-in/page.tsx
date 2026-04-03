import { unstable_noStore as noStore } from "next/cache";

import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { LoggedInState } from "@/components/auth/LoggedInState";
import { LandingPage } from "@/components/landing/LandingPage";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Setup",
  description: "Complete your first secure Metis setup steps.",
});

export default async function LoggedInPage() {
  noStore();
  const user = await requireAuthenticatedUser();

  return (
    <>
      <LandingPage />
      <AuthOverlay>
        <LoggedInState email={user.email} />
      </AuthOverlay>
    </>
  );
}
