import { AuthScreen } from "@/components/auth/AuthScreen";
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
  const params = searchParams ? await searchParams : undefined;

  return (
    <AuthScreen
      mode="sign-in"
      initialError={params?.error ?? null}
      initialMessage={params?.message ?? null}
    />
  );
}
