import { createPrivateMetadata } from "@/lib/seo";
import { AccountSectionPage } from "@/app/account/account-section-page";

export const metadata = createPrivateMetadata({
  title: "Metis Dash",
  description: "Review your Metis Dash account, API beta status, security posture, and plan access.",
});

type AccountPageProps = {
  searchParams?: Promise<{
    auth?: string;
    intent?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = searchParams ? await searchParams : undefined;
  return <AccountSectionPage section="account" auth={params?.auth} intent={params?.intent} />;
}
