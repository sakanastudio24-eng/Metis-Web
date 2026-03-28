import { getWebEnv } from "@/lib/env";

const env = getWebEnv();

export const siteConfig = {
  name: "Metis",
  url: "https://metis.zward.studio",
  wardStudioUrl: "https://zward.studio",
  apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL,
  repoUrl: "https://github.com/sakanastudio24-eng/Metis-Web",
  extensionRepoDocsUrl: "https://github.com/sakanastudio24-eng/Metis-Web",
};
