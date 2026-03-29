import { AuthScreen } from "@/components/auth/AuthScreen";
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
  const params = searchParams ? await searchParams : undefined;

  return (
    <AuthScreen
      mode="sign-up"
      initialError={params?.error ?? null}
      initialMessage={params?.message ?? null}
    />
  );
}
