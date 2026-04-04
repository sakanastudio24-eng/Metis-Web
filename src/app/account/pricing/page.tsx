import { createPrivateMetadata } from "@/lib/seo";
import { AccountSectionPage } from "@/app/account/account-section-page";

export const metadata = createPrivateMetadata({
  title: "Plan & Pricing",
  description: "Review your Metis plan access and Plus Beta enrollment options.",
});

type AccountPricingPageProps = {
  searchParams?: Promise<{
    auth?: string;
    intent?: string;
  }>;
};

export default async function AccountPricingPage({ searchParams }: AccountPricingPageProps) {
  const params = searchParams ? await searchParams : undefined;
  return <AccountSectionPage section="pricing" auth={params?.auth} intent={params?.intent} />;
}
