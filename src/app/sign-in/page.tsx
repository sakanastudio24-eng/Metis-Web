import { HomeWithAuthOverlay } from "@/components/auth/HomeWithAuthOverlay";
import { redirectIfAuthenticated } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Sign in",
  description: "Access your Metis account securely.",
});

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  await redirectIfAuthenticated();
  const params = searchParams ? await searchParams : undefined;

  return (
    <HomeWithAuthOverlay
      mode="sign-in"
      initialError={params?.error ?? null}
      initialMessage={params?.message ?? null}
    />
  );
}
