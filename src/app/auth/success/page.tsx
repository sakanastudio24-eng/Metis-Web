import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { AuthSuccessBridge } from "@/components/auth/AuthSuccessBridge";
import { getAuthenticatedUserOrNull } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Extension handoff",
  description: "Hand authenticated Metis access back to the extension.",
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

  return <AuthSuccessBridge email={user.email} />;
}
