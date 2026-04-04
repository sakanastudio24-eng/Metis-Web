import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Jua } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

import { defaultSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultSiteMetadata;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  display: "swap",
});

const jua = Jua({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${dmSerifDisplay.variable} ${jua.variable}`}>
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-left" theme="dark" />
      </body>
    </html>
  );
}
