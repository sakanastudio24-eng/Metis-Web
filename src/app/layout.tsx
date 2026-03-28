import type { Metadata } from "next";
import { Toaster } from "sonner";

import { siteConfig } from "@/lib/site";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Metis | Cost intelligence for the modern web",
  description:
    "Metis helps teams see where frontend waste comes from, understand the real cost of each session, and move from guesswork to ranked fixes.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        {children}
        <Toaster position="bottom-left" theme="dark" />
      </body>
    </html>
  );
}
