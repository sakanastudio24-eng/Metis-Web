import { getWebEnv } from "@/lib/env";

const env = getWebEnv();

export const siteConfig = {
  name: "Metis",
  url: "https://metis.zward.studio",
  description:
    "Metis helps teams understand frontend cost risk, review real session spend, and move from guesswork to ranked fixes.",
  keywords: [
    "frontend cost intelligence",
    "frontend cost analysis",
    "web performance cost",
    "browser extension performance",
    "session cost analysis",
    "engineering cost visibility",
    "frontend optimization",
    "Metis",
  ],
  wardStudioUrl: "https://zward.studio",
  apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL,
  apiEnabled: Boolean(env.NEXT_PUBLIC_API_BASE_URL),
  repoUrl: "https://github.com/sakanastudio24-eng/Metis-Web",
  extensionRepoDocsUrl: "https://github.com/sakanastudio24-eng/Metis",
};
