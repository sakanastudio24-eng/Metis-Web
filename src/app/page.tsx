import { LandingPage } from "@/components/landing/LandingPage";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Metis | Frontend cost intelligence for the modern web",
  description:
    "Metis helps teams surface frontend cost risk, understand real session spend, and move from guesswork to ranked fixes.",
  path: "/",
});

export default async function HomePage() {
  return <LandingPage />;
}
