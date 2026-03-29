import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

const DEFAULT_TITLE = "Metis | Cost intelligence for the modern web";
const DEFAULT_DESCRIPTION =
  "Metis helps teams see where frontend waste comes from, understand the real cost of each session, and move from guesswork to ranked fixes.";

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
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
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
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteName: siteConfig.name,
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
  },
};
