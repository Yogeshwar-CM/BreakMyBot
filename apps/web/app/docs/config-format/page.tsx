import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { sampleConfig } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Config format",
  path: "/docs/config-format",
  description: "BreakMyBot config format for single-call AI API stress testing.",
});

export default function ConfigFormatPage() {
  return (
    <DocShell
      currentPath="/docs/config-format"
      eyebrow="Docs"
      summary="BreakMyBot uses a YAML config so the test target, request template, expectations, and run settings stay explicit and versionable."
      title="Config format"
    >
      <CodePanel code={sampleConfig} label="config.yaml" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Top-level sections
        </h2>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            {
              key: "endpoint",
              value:
                "Target URL, HTTP method, and any headers needed to reach the API.",
            },
            {
              key: "request",
              value:
                "The request template and the variable path that BreakMyBot should mutate.",
            },
            {
              key: "expectations",
              value:
                "Optional schema hints for validating structure on returned payloads.",
            },
            {
              key: "run",
              value:
                "Iteration count and mutation strategy for the test session.",
            },
            {
              key: "sample_inputs",
              value:
                "Representative prompts or payload values to use as the mutation base set.",
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
