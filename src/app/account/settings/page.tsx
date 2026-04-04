import { createPrivateMetadata } from "@/lib/seo";
import { AccountSectionPage } from "@/app/account/account-section-page";

export const metadata = createPrivateMetadata({
  title: "Settings",
  description: "Review website-managed Metis settings and account removal options.",
});

type AccountSettingsPageProps = {
  searchParams?: Promise<{
    auth?: string;
    intent?: string;
  }>;
};

export default async function AccountSettingsPage({ searchParams }: AccountSettingsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  return <AccountSectionPage section="settings" auth={params?.auth} intent={params?.intent} />;
}
