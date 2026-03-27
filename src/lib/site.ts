import { getWebEnv } from "@/lib/env";

const env = getWebEnv();

export const siteConfig = {
  name: "Metis",
  url: env.NEXT_PUBLIC_SITE_URL,
  wardStudioUrl: env.NEXT_PUBLIC_WARD_STUDIO_URL,
  apiBaseUrl: env.NEXT_PUBLIC_METIS_API_BASE_URL,
  repoUrl: "https://github.com/sakanastudio24-eng/Metis-Web",
  extensionRepoDocsUrl: "https://github.com/sakanastudio24-eng/Metis-Web",
};
