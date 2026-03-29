import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";

import { defaultSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultSiteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="dark">
        {children}
        <Toaster position="bottom-left" theme="dark" />
      </body>
    </html>
  );
}
