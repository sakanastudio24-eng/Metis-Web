import { LandingPage } from "@/components/landing/LandingPage";
import { getAuthenticatedUserOrNull } from "@/lib/auth-server";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Metis | Frontend cost intelligence for the modern web",
  description:
    "Metis helps teams surface frontend cost risk, understand real session spend, and move from guesswork to ranked fixes.",
  path: "/",
});

export default async function HomePage() {
  const viewer = await getAuthenticatedUserOrNull();

  return (
    <LandingPage
      viewer={{
        email: viewer?.email ?? null,
        hasAccountAccess: Boolean(viewer),
      }}
    />
  );
}
