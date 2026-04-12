function readOptionalPublicUrl(value: string | undefined) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  try {
    return new URL(trimmed).toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

const publicApiBaseUrl = readOptionalPublicUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

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
  apiBaseUrl: publicApiBaseUrl,
  apiEnabled: Boolean(publicApiBaseUrl),
  repoUrl: "https://github.com/sakanastudio24-eng/Metis-Web",
  extensionRepoDocsUrl: "https://github.com/sakanastudio24-eng/Metis",
};
