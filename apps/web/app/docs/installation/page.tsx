import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { installFromSource } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Installation",
  path: "/docs/installation",
  description: "Install BreakMyBot locally and prepare the open-source CLI.",
});

export default function InstallationPage() {
  return (
    <DocShell
      currentPath="/docs/installation"
      eyebrow="Docs"
      summary="BreakMyBot is currently distributed as an open-source repository. Clone it locally, create a virtual environment, and install the CLI in editable mode."
      title="Install BreakMyBot locally"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Requirements
        </h2>
        <ul className="space-y-3 text-base leading-8 text-white/62">
          <li>Python 3.11 or newer</li>
          <li>A reachable single-call AI API endpoint</li>
          <li>An API token or auth header for your target service</li>
        </ul>
      </section>

      <CodePanel code={installFromSource} label="install from source" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Notes
        </h2>
        <p className="text-base leading-8 text-white/62">
          The CLI is currently source-first. Clone the repository, install it in
          editable mode, and use the example config as your starting point.
        </p>
      </section>
    </DocShell>
  );
}
