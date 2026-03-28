import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "BreakMyBot Studio",
  description:
    "Local studio for configuring target APIs and running BreakMyBot's agent-driven tests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
