import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="page-shell pt-5">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
        <Link
          className="text-lg font-semibold tracking-[0.08em] text-white"
          href="/"
        >
          BreakMyBot
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm text-white/56 md:flex"
        >
          <Link className="transition-colors hover:text-white" href="/docs/installation">
            Installation
          </Link>
          <Link className="transition-colors hover:text-white" href="/docs/quickstart">
            Quickstart
          </Link>
          <Link className="transition-colors hover:text-white" href="/docs/config-format">
            Config
          </Link>
        </nav>

        <Button
          asChild
          className="rounded-full border border-white/12 bg-white text-black hover:bg-white/90"
          size="sm"
        >
          <a href={siteConfig.repoUrl} rel="noreferrer" target="_blank">
            View on GitHub
          </a>
        </Button>
      </div>
    </header>
  );
}
