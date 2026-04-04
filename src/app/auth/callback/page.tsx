import { unstable_noStore as noStore } from "next/cache";

import { AuthCallbackScreen } from "@/components/auth/AuthCallbackScreen";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Signing you in",
  description: "Confirming your Metis sign-in and redirecting you now.",
});

type AuthCallbackPageProps = {
  searchParams?: Promise<{
    code?: string;
    error?: string;
    error_description?: string;
    intent?: string;
    magic_link?: string;
    next?: string;
    section?: string;
    source?: string;
  }>;
};

export default async function AuthCallbackPage({ searchParams }: AuthCallbackPageProps) {
  noStore();
  const params = searchParams ? await searchParams : undefined;

  return (
    <AuthCallbackScreen
      code={params?.code ?? null}
      error={params?.error ?? null}
      errorDescription={params?.error_description ?? null}
      intent={params?.intent ?? null}
      nextPath={params?.next ?? null}
      section={params?.section ?? null}
      source={params?.source ?? null}
      magicLinkMode={params?.magic_link ?? null}
    />
  );
}
