import { LoggedInState } from "@/components/auth/LoggedInState";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Setup",
  description: "Complete your first secure Metis setup steps.",
});

export default async function LoggedInPage() {
  const user = await requireAuthenticatedUser();

  return <LoggedInState email={user.email} />;
}
