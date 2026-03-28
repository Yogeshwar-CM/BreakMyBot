import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { sampleReport, setupCommand } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Example run",
  path: "/docs/example-run",
  description: "See a sample BreakMyBot setup flow and example report output.",
});

export default function ExampleRunPage() {
  return (
    <DocShell
      currentPath="/docs/example-run"
      eyebrow="Docs"
      summary="A BreakMyBot session starts with provider setup, then moves into the local studio where the agent plans probes and compiles a concrete failure report."
      title="Example run"
    >
      <CodePanel code={setupCommand} label="setup" />
      <CodePanel code={sampleReport} label="sample report" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          What the report should show
        </h2>
        <p className="text-base leading-8 text-white/62">
          The useful output is not abstract scoring. It is a concrete set of
          failure cases, instability across retries, malformed responses, schema
          drift, and enough context to help the developer reproduce and fix the
          endpoint behavior.
        </p>
      </section>
    </DocShell>
  );
}
