import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

const DEFAULT_TITLE = "Metis | Frontend cost intelligence for the modern web";
const DEFAULT_DESCRIPTION = siteConfig.description;

type PublicMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

type PrivateMetadataOptions = {
  title: string;
  description: string;
};

export function createPublicMetadata({
  title,
  description,
  path,
}: PublicMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    category: "technology",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function createPrivateMetadata({
  title,
  description,
}: PrivateMetadataOptions): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        nosnippet: true,
      },
    },
  };
}

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Metis",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Metis",
  keywords: siteConfig.keywords,
  authors: [{ name: "zward.studio", url: siteConfig.wardStudioUrl }],
  creator: "zward.studio",
  publisher: "zward.studio",
  category: "technology",
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: siteConfig.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
