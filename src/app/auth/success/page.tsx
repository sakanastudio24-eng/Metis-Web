import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthenticatedUserOrNull } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Connecting",
  description: "Connect your website session to the Metis extension.",
});

type AuthSuccessPageProps = {
  searchParams?: Promise<{
    extensionId?: string;
  }>;
};

export default async function AuthSuccessPage({ searchParams }: AuthSuccessPageProps) {
  noStore();
  const params = searchParams ? await searchParams : undefined;
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    redirect(
      params?.extensionId
        ? `/sign-in?source=extension&extensionId=${encodeURIComponent(params.extensionId)}`
        : "/sign-in?source=extension"
    );
  }

  if (user.deletedAt) {
    redirect("/account-deleted");
  }

  redirect(
    params?.extensionId
      ? `/account/settings?source=extension&extensionId=${encodeURIComponent(params.extensionId)}`
      : "/account/settings?source=extension"
  );
}
