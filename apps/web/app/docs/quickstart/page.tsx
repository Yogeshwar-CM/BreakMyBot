import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { cliCommand, sampleConfig } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Quickstart",
  path: "/docs/quickstart",
  description: "Quickstart guide for running BreakMyBot against a single-call AI API.",
});

const envExample = String.raw`export AI_API_TOKEN="replace-me"`;

export default function QuickstartPage() {
  return (
    <DocShell
      currentPath="/docs/quickstart"
      eyebrow="Docs"
      summary="The shortest useful path is: define a YAML config, set the token in your shell, and run the CLI locally against the target endpoint."
      title="Quickstart"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          1. Create the config
        </h2>
        <p className="text-base leading-8 text-white/62">
          Start with a small config that targets one endpoint, one request
          template, and a handful of representative sample inputs.
        </p>
        <CodePanel code={sampleConfig} label="config.yaml" />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          2. Export your token
        </h2>
        <CodePanel code={envExample} label="shell" />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          3. Run the CLI
        </h2>
        <CodePanel code={cliCommand} label="command" />
        <p className="text-base leading-8 text-white/62">
          The current repo includes the CLI scaffold and config loading path.
          Request mutation, endpoint execution, and detailed report generation
          are the next implementation steps.
        </p>
      </section>
    </DocShell>
  );
}
