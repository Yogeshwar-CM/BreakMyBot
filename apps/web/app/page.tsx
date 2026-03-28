import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Github,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
} from "lucide-react";

import { CodePanel } from "@/components/site/code-panel";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { absoluteUrl, buildMetadata, siteConfig } from "@/lib/site";
import {
  docsNavigation,
  sampleReport,
  sampleStudioContract,
  setupCommand,
  uiCommand,
} from "@/lib/docs";

export const metadata: Metadata = buildMetadata({
  path: "/",
  keywords: [
    "AI API testing agent",
    "local AI API testing studio",
    "adaptive single-call AI endpoint testing",
  ],
});

const findings = [
  {
    name: "Provider-backed attack planning",
    copy: "Use your configured OpenAI, Anthropic, or Groq model so BreakMyBot plans probes instead of relying on a static mutation list.",
  },
  {
    name: "Request-shape awareness",
    copy: "Tell BreakMyBot how the target request is structured and where the input field lives so the agent can probe the real contract cleanly.",
  },
  {
    name: "Malformed and schema-breaking responses",
    copy: "Catch broken JSON, missing fields, wrong types, and output shapes that would blow up downstream consumers.",
  },
  {
    name: "Retry instability",
    copy: "Run repeat probes so BreakMyBot can catch cases where the same input drifts across attempts.",
  },
  {
    name: "Edge-case breakdowns",
    copy: "Pressure-test empty, noisy, ambiguous, and boundary-case inputs that casual manual testing rarely covers.",
  },
] as const;

const steps = [
  {
    step: "01",
    title: "Set up provider",
    copy: "Choose the AI provider BreakMyBot should use for reasoning and save the API key locally with `breakmybot setup`.",
  },
  {
    step: "02",
    title: "Launch local studio",
    copy: "Open the separate local studio with `breakmybot ui`, then enter the target endpoint, auth headers, request shape, and optional response contract.",
  },
  {
    step: "03",
    title: "Let the agent probe",
    copy: "The agent plans targeted attacks, executes them against the endpoint, retries cases, and returns a report with concrete breakpoints.",
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
                  Let an AI agent break your AI API before production does.
                </h1>
                <p className="max-w-[38rem] text-pretty text-lg leading-8 text-white/64">
                  BreakMyBot is an open-source CLI that asks for your provider,
                  launches a separate local studio, and uses adaptive planning
                  to pressure-test single-call AI endpoints.
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
                    Install locally, run setup once, then launch the separate
                    studio from your machine.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Agent-driven</p>
                  <p className="mt-2 text-sm leading-7 text-white/54">
                    The agent thinks through the target contract instead of
                    blindly replaying one fixed mutation recipe.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Local studio</p>
                  <p className="mt-2 text-sm leading-7 text-white/54">
                    The public docs site is separate from the local Postman-like
                    workspace where target setup and runs happen.
                  </p>
                </div>
              </div>
            </div>

            <CodePanel className="min-h-[20rem]" code={setupCommand} label="breakmybot setup" />
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
                  fall apart when inputs get noisy, malformed, ambiguous, or
                  only slightly different.
                </p>
                <p>
                  BreakMyBot is built for the black-box version of that problem:
                  you know the endpoint, the auth, the request shape, and maybe
                  the expected response contract, but you need an agent to think
                  through the ways it might break.
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
                Provider. Studio. Agent.
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
                Local setup in. Adaptive report out.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="surface p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                    Commands
                  </p>
                  <div className="mt-4 space-y-3 font-mono text-sm text-white">
                    <p>{`breakmybot setup`}</p>
                    <p>{`breakmybot ui`}</p>
                  </div>
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
                <CodePanel code={sampleStudioContract} label="studio contract" />
                <CodePanel code={sampleReport} label="sample report" />
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="hairline pt-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="max-w-[42rem] space-y-5">
                <p className="section-label">Local studio</p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  A public docs page for understanding the tool. A separate
                  local studio for actually trying to break the target.
                </h2>
                <p className="text-base leading-8 text-white/62">
                  BreakMyBot does not pretend there is a hosted dashboard. The
                  docs site explains the product and drives GitHub adoption. The
                  real setup, provider configuration, and testing flow happen in
                  the local studio launched from the CLI.
                </p>
              </div>

              <div className="space-y-4 text-sm leading-7 text-white/58">
                <p className="flex items-start gap-3">
                  <SquareTerminal className="mt-1 h-4 w-4 shrink-0 text-white/48" />
                  Works well for scorers, classifiers, extractors, moderation endpoints, structured JSON generators, and evaluators.
                </p>
                <p className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-white/48" />
                  Not designed for multi-turn chat systems, browser automation, chatbot UI scraping, or full agent systems.
                </p>
                <p className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-white/48" />
                  Setup asks for the provider because the agent should think about the target, not just replay canned probes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pt-24">
          <div className="surface flex flex-col gap-6 px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[34rem] space-y-3">
              <p className="section-label">Get started</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Configure the provider. Launch the studio. Let the agent push on the endpoint.
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
