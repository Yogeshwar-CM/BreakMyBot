import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { buildMetadata } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
