import Link from "next/link";

import { docsNavigation } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="hairline mt-20">
      <div className="page-shell py-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_0.8fr_0.8fr]">
          <div className="max-w-[28rem] space-y-4">
            <p className="text-lg font-semibold tracking-[0.08em] text-white">
              BreakMyBot
            </p>
            <p className="text-sm leading-7 text-white/58">
              Open-source CLI for stress testing single-call AI APIs before
              production.
            </p>
          </div>

          <div className="space-y-4">
            <p className="section-label">Docs</p>
            <nav className="flex flex-col gap-3 text-sm text-white/62">
              {docsNavigation.map((item) => (
                <Link
                  className="transition-colors hover:text-white"
                  href={item.href}
                  key={item.href}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="section-label">Project</p>
            <div className="flex flex-col gap-3 text-sm text-white/62">
              <a
                className="transition-colors hover:text-white"
                href={siteConfig.repoUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <Link className="transition-colors hover:text-white" href="/">
                Home
              </Link>
              <a
                className="transition-colors hover:text-white"
                href={siteConfig.repoUrl}
                rel="noreferrer"
                target="_blank"
              >
                README
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-white/36">
          Stress test your AI API before production.
        </div>
      </div>
    </footer>
  );
}
