import { createPrivateMetadata } from "@/lib/seo";
import { redirect } from "next/navigation";

export const metadata = createPrivateMetadata({
  title: "Security",
  description: "Review current protection and linked sign-in methods for Metis.",
});

export default async function SecurityPage() {
  redirect("/account");
}
