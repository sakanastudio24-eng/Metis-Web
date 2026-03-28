import { AuthScreen } from "@/components/auth/AuthScreen";

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
