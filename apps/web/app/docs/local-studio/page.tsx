import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { sampleStudioContract, uiCommand } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Local studio",
  path: "/docs/local-studio",
  description:
    "Use the local BreakMyBot Studio UI to configure the target endpoint and launch the agent.",
});

export default function LocalStudioPage() {
  return (
    <DocShell
      currentPath="/docs/local-studio"
      eyebrow="Docs"
      summary="The local studio is a separate Next.js UI from the public docs site. It runs on your machine and acts like a focused Postman-style workspace for the target API under test."
      title="Work from the local studio"
    >
      <CodePanel code={uiCommand} label="breakmybot ui" />
      <CodePanel code={sampleStudioContract} label="target contract" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          What you define in the studio
        </h2>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            {
              key: "endpoint",
              value:
                "The target URL, HTTP method, and any auth headers needed to reach the API under test.",
            },
            {
              key: "request",
              value:
                "The request shape and the exact variable path where BreakMyBot should inject generated probe inputs.",
            },
            {
              key: "response",
              value:
                "Optional schema or notes that help BreakMyBot spot malformed or contract-breaking responses.",
            },
            {
              key: "run",
              value:
                "How many cases the agent should plan and execute during the local test session.",
            },
          ].map((item) => (
            <div
              className="grid gap-3 py-5 md:grid-cols-[12rem_minmax(0,1fr)]"
              key={item.key}
            >
              <p className="font-mono text-sm text-white">{item.key}</p>
              <p className="text-sm leading-7 text-white/58">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </DocShell>
  );
}
