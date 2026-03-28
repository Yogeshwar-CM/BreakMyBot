import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { sampleReport, setupCommand, uiCommand } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Quickstart",
  path: "/docs/quickstart",
  description:
    "Quickstart guide for setting up BreakMyBot, launching the local studio, and running the agent.",
});

export default function QuickstartPage() {
  return (
    <DocShell
      currentPath="/docs/quickstart"
      eyebrow="Docs"
      summary="The shortest useful path is: install the CLI, choose the agent provider, launch the local studio, configure the target endpoint, and let BreakMyBot run the session."
      title="Quickstart"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          1. Configure the agent provider
        </h2>
        <p className="text-base leading-8 text-white/62">
          Pick OpenAI, Anthropic, or Groq and store the provider key locally so
          BreakMyBot can use an actual reasoning model to plan tests.
        </p>
        <CodePanel code={setupCommand} label="breakmybot setup" />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          2. Launch the local studio
        </h2>
        <p className="text-base leading-8 text-white/62">
          The public docs site and the local studio are separate. The studio is
          the Postman-style UI where you configure the target endpoint under
          test.
        </p>
        <CodePanel code={uiCommand} label="breakmybot ui" />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          3. Review the first report
        </h2>
        <CodePanel code={sampleReport} label="sample report" />
        <p className="text-base leading-8 text-white/62">
          BreakMyBot should show the attack families it chose, the cases it
          injected, and where the endpoint produced malformed, unstable, or
          schema-breaking behavior.
        </p>
      </section>
    </DocShell>
  );
}
