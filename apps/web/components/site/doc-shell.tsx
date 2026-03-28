import Link from "next/link";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site/site-header";
import { docsNavigation } from "@/lib/docs";

type DocShellProps = {
  currentPath: string;
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function DocShell({
  currentPath,
  eyebrow,
  title,
  summary,
  children,
}: DocShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-14">
        <div className="grid gap-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <div className="space-y-3">
              <p className="section-label">Docs</p>
              <div className="space-y-3">
                {docsNavigation.map((item) => {
                  const active = item.href === currentPath;

                  return (
                    <Link
                      className={`block rounded-2xl border px-4 py-3 transition-colors ${
                        active
                          ? "border-white/16 bg-white/[0.05] text-white"
                          : "border-white/8 bg-transparent text-white/58 hover:border-white/14 hover:text-white"
                      }`}
                      href={item.href}
                      key={item.href}
                    >
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/48">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <article className="max-w-[48rem] space-y-10">
            <header className="space-y-5 border-b border-white/10 pb-10">
              <p className="section-label">{eyebrow}</p>
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                {title}
              </h1>
              <p className="max-w-[42rem] text-base leading-8 text-white/62 sm:text-[1.03rem]">
                {summary}
              </p>
            </header>

            <div className="space-y-10 pb-4">{children}</div>
          </article>
        </div>
      </main>
    </>
  );
}
