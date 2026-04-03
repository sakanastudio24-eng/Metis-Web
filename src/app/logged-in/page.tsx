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

type LoggedInPageProps = {
  searchParams?: Promise<{
    auth?: string;
  }>;
};

export default async function LoggedInPage({ searchParams }: LoggedInPageProps) {
  noStore();
  const params = searchParams ? await searchParams : undefined;
  const user = await requireAuthenticatedUser();

  return (
    <>
      <LandingPage />
      <AuthOverlay>
        <LoggedInState email={user.email} showAuthConfirmation={params?.auth === "confirmed"} />
      </AuthOverlay>
    </>
  );
}
