import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthenticatedUserOrNull } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Connecting",
  description: "Connect your website session to the Metis extension.",
});

export default async function AuthSuccessPage() {
  noStore();
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    redirect("/sign-in?source=extension");
  }

  if (user.deletedAt) {
    redirect("/account-deleted");
  }

  redirect("/account/settings?source=extension");
}
