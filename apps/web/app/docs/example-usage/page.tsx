import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { cliCommand, sampleOutput } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Example usage",
  path: "/docs/example-usage",
  description: "Example BreakMyBot CLI usage and sample output.",
});

export default function ExampleUsagePage() {
  return (
    <DocShell
      currentPath="/docs/example-usage"
      eyebrow="Docs"
      summary="The CLI stays intentionally simple: point it at a config file, run the test command locally, and review the resulting summary."
      title="Example usage"
    >
      <CodePanel code={cliCommand} label="command" />
      <CodePanel code={sampleOutput} label="illustrative output" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Output goals
        </h2>
        <p className="text-base leading-8 text-white/62">
          The eventual report flow should show failing cases, instability
          examples, schema issues, and enough context for a developer to fix the
          endpoint or tighten the contract before shipping.
        </p>
      </section>
    </DocShell>
  );
}
