import { unstable_noStore as noStore } from "next/cache";

import { DeleteAccountClient } from "@/components/auth/DeleteAccountClient";
import { requireAuthenticatedUser } from "@/lib/auth-server";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Delete account",
  description: "Review the Metis danger zone and confirm account removal.",
});

type DeleteAccountPageProps = {
  searchParams?: Promise<{
    auth?: string;
  }>;
};

export default async function DeleteAccountPage({ searchParams }: DeleteAccountPageProps) {
  noStore();
  const params = searchParams ? await searchParams : undefined;
  const user = await requireAuthenticatedUser();

  return (
    <DeleteAccountClient
      email={user.email}
      username={user.username}
      authConfirmed={params?.auth === "confirmed"}
    />
  );
}
