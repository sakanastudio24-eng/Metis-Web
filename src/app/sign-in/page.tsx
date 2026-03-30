import { METIS_EXTENSION_SOURCE, isExtensionAuthSource } from "@/lib/contracts/communication";
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
    source?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const source = isExtensionAuthSource(params?.source) ? METIS_EXTENSION_SOURCE : null;
  await redirectIfAuthenticated(source);

  return (
    <HomeWithAuthOverlay
      initialView="login"
      source={source}
      initialError={params?.error ?? null}
      initialMessage={params?.message ?? null}
    />
  );
}
