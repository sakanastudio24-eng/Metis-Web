import { HomeWithAuthOverlay } from "@/components/auth/HomeWithAuthOverlay";
import { redirectIfAuthenticated } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Create account",
  description: "Create secure access for Metis.",
});

type SignUpPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  await redirectIfAuthenticated();
  const params = searchParams ? await searchParams : undefined;

  return (
    <HomeWithAuthOverlay
      initialView="signup"
      initialError={params?.error ?? null}
      initialMessage={params?.message ?? null}
    />
  );
}
