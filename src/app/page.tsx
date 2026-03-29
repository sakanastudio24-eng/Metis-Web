import { LandingPage } from "@/components/landing/LandingPage";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Metis | Cost intelligence for the modern web",
  description:
    "Metis helps teams see where frontend waste comes from, understand the real cost of each session, and move from guesswork to ranked fixes.",
  path: "/",
});

export default function HomePage() {
  return <LandingPage />;
}
