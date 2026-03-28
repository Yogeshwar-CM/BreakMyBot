import type { Metadata } from "next";

import { CodePanel } from "@/components/site/code-panel";
import { DocShell } from "@/components/site/doc-shell";
import { setupCommand } from "@/lib/docs";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Provider setup",
  path: "/docs/provider-setup",
  description:
    "Choose the agent provider and save the API key locally for BreakMyBot.",
});

export default function ProviderSetupPage() {
  return (
    <DocShell
      currentPath="/docs/provider-setup"
      eyebrow="Docs"
      summary="BreakMyBot asks for the AI provider it should use for reasoning, then stores the API key locally so the agent can plan attacks dynamically instead of relying on a fixed mutation list."
      title="Set up the agent provider"
    >
      <CodePanel code={setupCommand} label="breakmybot setup" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Supported providers
        </h2>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            {
              key: "OpenAI",
              value:
                "Use an OpenAI key and model when you want BreakMyBot's agent to plan probes through OpenAI's API.",
            },
            {
              key: "Anthropic",
              value:
                "Use Anthropic if you want the planning agent to run through Claude models.",
            },
            {
              key: "Groq",
              value:
                "Use Groq when you want planning through Groq's OpenAI-compatible interface.",
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
