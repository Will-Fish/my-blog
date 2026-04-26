import type { Metadata } from "next";
import "./globals.css";
import { BackToTopButton } from "@/components/BackToTopButton";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: siteConfig.title,
    template: "%s | Mer-Ape",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
