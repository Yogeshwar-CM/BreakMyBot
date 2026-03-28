import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Github } from "lucide-react";

import { CodePanel } from "@/components/site/code-panel";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import {
  absoluteUrl,
  buildMetadata,
  siteConfig,
} from "@/lib/site";
import {
  cliCommand,
  docsNavigation,
  sampleConfig,
  sampleOutput,
} from "@/lib/docs";

export const metadata: Metadata = buildMetadata({
  path: "/",
  keywords: [
    "open source AI API CLI",
    "single-call AI endpoint testing",
    "stress test your AI API before production",
  ],
});

const findings = [
  {
    name: "Inconsistent outputs",
    copy: "Find responses that shift materially across repeated or near-identical inputs.",
  },
  {
    name: "Schema mismatches",
    copy: "Catch missing fields, wrong types, and shape drift before downstream code breaks.",
  },
  {
    name: "Malformed responses",
    copy: "Surface invalid JSON and broken payloads that pass casual manual checks.",
  },
  {
    name: "Sensitivity to input changes",
    copy: "Reveal cases where tiny wording edits cause large output changes.",
  },
  {
    name: "Edge-case breakdowns",
    copy: "Pressure-test short, noisy, empty, ambiguous, and uneven payloads.",
  },
] as const;

const steps = [
  {
    step: "01",
    title: "Define config",
    copy: "Point BreakMyBot at the endpoint, provide the request template, and describe the response shape you expect.",
  },
  {
    step: "02",
    title: "Run CLI",
    copy: "Execute one command locally to run repeated and mutated tests against the external API.",
  },
  {
    step: "03",
    title: "Inspect report",
    copy: "Review concrete failures, instability cases, and schema issues before production traffic finds them first.",
  },
] as const;

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: siteConfig.name,
    codeRepository: siteConfig.repoUrl,
    programmingLanguage: ["Python", "TypeScript"],
    description: siteConfig.description,
    url: absoluteUrl("/"),
  },
] as const;

export default function HomePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        type="application/ld+json"
      />

      <main className="relative overflow-hidden">
        <SiteHeader />

        <section className="page-shell pt-16 sm:pt-20">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start">
            <div className="max-w-[40rem] space-y-8">
              <p className="section-label">Open-source CLI</p>
              <div className="space-y-6">
                <h1 className="text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl lg:text-[4.5rem]">
                  Stress test your AI API before production
                </h1>
                <p className="max-w-[38rem] text-pretty text-lg leading-8 text-white/64">
                  An open-source CLI for finding instability, schema failures,
                  and edge-case breakdowns in single-call AI endpoints.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-11 rounded-full bg-white px-5 text-black hover:bg-white/92"
                >
                  <a href={siteConfig.repoUrl} rel="noreferrer" target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
                <Button
                  asChild
                  className="h-11 rounded-full border border-white/12 bg-transparent px-5 text-white hover:bg-white/[0.04]"
                  variant="outline"
                >
                  <Link href={siteConfig.docs.quickstart}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Read Quickstart
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-white">CLI-first</p>
                  <p className="mt-2 text-sm leading-7 text-white/54">
                    Run locally. No hosted dashboard. No SaaS-only setup.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Black-box API testing</p>
                  <p className="mt-2 text-sm leading-7 text-white/54">
                    Built for external single-call AI APIs such as scorers,
                    classifiers, and extractors.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Useful reports</p>
                  <p className="mt-2 text-sm leading-7 text-white/54">
                    Focus on schema failures, unstable outputs, and concrete
                    breakpoints.
                  </p>
                </div>
              </div>
            </div>

            <CodePanel className="min-h-[20rem]" code={sampleOutput} label={cliCommand} />
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="hairline pt-14">
            <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <div className="space-y-3">
                <p className="section-label">Problem</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  AI APIs often pass small tests and still fail in the wild.
                </h2>
              </div>
              <div className="max-w-[42rem] space-y-5 text-base leading-8 text-white/62">
                <p>
                  A clean manual request is not a reliability signal. Many
                  single-call AI endpoints look fine on the happy path and then
                  drift when real inputs get short, noisy, malformed, ambiguous,
                  or only slightly different.
                </p>
                <p>
                  BreakMyBot is built to expose those failures before they land
                  in scoring pipelines, moderation workflows, extraction jobs,
                  evaluator systems, or structured JSON consumers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="hairline pt-14">
            <div className="max-w-[34rem] space-y-4">
              <p className="section-label">What it finds</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                The failures worth catching before users do.
              </h2>
            </div>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {findings.map((item) => (
                <article
                  className="grid gap-3 py-5 md:grid-cols-[17rem_minmax(0,1fr)]"
                  key={item.name}
                >
                  <h3 className="text-lg font-medium text-white">{item.name}</h3>
                  <p className="max-w-[36rem] text-sm leading-7 text-white/58">
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="hairline pt-14">
            <div className="max-w-[34rem] space-y-4">
              <p className="section-label">How it works</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Three steps. Local and direct.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {steps.map((item) => (
                <section className="surface p-6" key={item.step}>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                    {item.step}
                  </p>
                  <h3 className="mt-4 text-xl font-medium text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/58">
                    {item.copy}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="hairline pt-14">
            <div className="max-w-[34rem] space-y-4">
              <p className="section-label">Example CLI usage</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Config in. Report out.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="surface p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                    Command
                  </p>
                  <p className="mt-4 font-mono text-sm text-white">{cliCommand}</p>
                </div>

                <div className="space-y-3">
                  {docsNavigation.map((item) => (
                    <Link
                      className="block rounded-2xl border border-white/10 px-4 py-4 text-sm text-white/58 transition-colors hover:border-white/18 hover:text-white"
                      href={item.href}
                      key={item.href}
                    >
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 leading-6">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <CodePanel code={sampleConfig} label="config.yaml" />
                <CodePanel code={sampleOutput} label="sample report" />
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="hairline pt-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="max-w-[42rem] space-y-5">
                <p className="section-label">Open source</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  Built for developers who want local control, inspectable config,
                  and a simple path to reliability testing.
                </h2>
                <p className="text-base leading-8 text-white/62">
                  BreakMyBot is CLI-first on purpose. It does not pretend there
                  is a hosted dashboard, a browser automation layer, or a full
                  chatbot simulation system. It stays focused on stress testing
                  single-call AI APIs well.
                </p>
              </div>

              <div className="space-y-4 text-sm leading-7 text-white/58">
                <p>Works well for scorers, classifiers, extractors, moderation endpoints, structured JSON generators, and evaluators.</p>
                <p>Not designed for multi-turn chat systems, browser automation, chatbot UI scraping, or full agent systems.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="surface flex flex-col gap-6 px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[34rem] space-y-3">
              <p className="section-label">Get started</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Clone it. Configure it. Break the endpoint before production does.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 rounded-full bg-white px-5 text-black hover:bg-white/92"
              >
                <a href={siteConfig.repoUrl} rel="noreferrer" target="_blank">
                  View on GitHub
                </a>
              </Button>
              <Button
                asChild
                className="h-11 rounded-full border border-white/12 bg-transparent px-5 text-white hover:bg-white/[0.04]"
                variant="outline"
              >
                <Link href={siteConfig.docs.quickstart}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
