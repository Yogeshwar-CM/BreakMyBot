import type { Metadata } from "next";

export const siteConfig = {
  name: "BreakMyBot",
  defaultTitle: "Stress test your AI API before production",
  description:
    "An open-source CLI that lets you configure an AI provider, launch a local studio, and use an adaptive agent to break single-call AI APIs before production.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.breakmybot.com",
  repoUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/Yogeshwar-CM/BreakMyBot",
  locale: "en_US",
  keywords: [
    "BreakMyBot",
    "open source CLI",
    "AI API testing",
    "AI API stress testing",
    "single-call AI API testing",
    "AI API schema validation",
    "AI API instability testing",
    "AI endpoint testing",
    "CLI for AI APIs",
    "AI agent API testing",
    "local AI API testing studio",
  ],
  docs: {
    installation: "/docs/installation",
    providerSetup: "/docs/provider-setup",
    quickstart: "/docs/quickstart",
    localStudio: "/docs/local-studio",
    exampleRun: "/docs/example-run",
  },
} as const;

export type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  noIndex = false,
}: BuildMetadataInput = {}): Metadata {
  const resolvedTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.defaultTitle}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: resolvedTitle,
    description,
    applicationName: siteConfig.name,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      title: resolvedTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    category: "developer tools",
  };
}
