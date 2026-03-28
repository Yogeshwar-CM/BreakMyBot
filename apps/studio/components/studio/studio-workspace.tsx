"use client";

import { startTransition, useMemo, useState, useTransition } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  LoaderCircle,
  Play,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import { ReportPanel } from "@/components/studio/report-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProviderSummary, RunReport, StudioFormInput } from "@/lib/types";

const exampleWorkspace: StudioFormInput = {
  endpointUrl: "https://api.example.com/v1/moderate",
  method: "POST",
  headersText: JSON.stringify(
    {
      Authorization: "Bearer target-api-key",
    },
    null,
    2,
  ),
  requestTemplateText: JSON.stringify(
    {
      input: {
        text: "{{input}}",
      },
    },
    null,
    2,
  ),
  variablePath: "input.text",
  seedInputsText: [
    "This product launch sounds polished and safe.",
    "worst product ever???",
    "",
  ].join("\n"),
  endpointNotes:
    "Single-call moderation endpoint that should return a structured JSON verdict.",
  responseSchemaText: JSON.stringify(
    {
      type: "object",
      required: ["label", "score"],
      properties: {
        label: { type: "string" },
        score: { type: "number" },
      },
    },
    null,
    2,
  ),
  responseNotes:
    "Response should stay valid JSON and preserve label + score across close variants.",
  maxCases: 6,
};

type StudioWorkspaceProps = {
  providerSummary: ProviderSummary;
};

export function StudioWorkspace({ providerSummary }: StudioWorkspaceProps) {
  const [isPending, startRun] = useTransition();
  const [statusMessage, setStatusMessage] = useState(
    providerSummary.configured
      ? "Ready. Configure the target endpoint and let the agent plan probes."
      : "Provider runtime is not configured yet. Run `breakmybot setup` first.",
  );
  const [report, setReport] = useState<RunReport | null>(null);
  const [form, setForm] = useState<StudioFormInput>(exampleWorkspace);

  const providerPill = useMemo(() => {
    if (!providerSummary.configured || !providerSummary.provider || !providerSummary.model) {
      return "provider missing";
    }

    return `${providerSummary.provider} · ${providerSummary.model}`;
  }, [providerSummary]);

  async function runAgent() {
    startRun(async () => {
      setStatusMessage("Agent is planning attack cases and probing the endpoint.");
      setReport(null);

      const response = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as
        | { report: RunReport }
        | { error: string };

      if (!response.ok || !("report" in data)) {
        setStatusMessage(
          "Run failed. Check the form payloads and provider setup, then try again.",
        );
        return;
      }

      startTransition(() => {
        setReport(data.report);
        setStatusMessage("Report ready. Review failures, instability, and schema drift.");
      });
    });
  }

  return (
    <main className="studio-shell">
      <header className="flex flex-col gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[42rem] space-y-4">
          <p className="label">Local studio</p>
          <h1 className="text-balance font-display text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
            Break your target API with a local agent before production does.
          </h1>
          <p className="max-w-[36rem] text-pretty text-base leading-8 text-white/58">
            This workspace is separate from the public docs site. It runs
            locally, uses the provider you configured with the CLI, and probes a
            target single-call AI endpoint using adaptive attack planning.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="panel flex items-center gap-3 px-4 py-3">
            <Badge variant={providerSummary.configured ? "success" : "warning"}>
              {providerPill}
            </Badge>
            <p className="text-sm text-white/52">
              {providerSummary.configured ? "agent runtime ready" : "run setup first"}
            </p>
          </div>
          <Button
            className="gap-2"
            disabled={isPending || !providerSummary.configured}
            onClick={runAgent}
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run agent
          </Button>
        </div>
      </header>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.92fr)]">
        <div className="space-y-6">
          <section className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <p className="label">Target endpoint</p>
                <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">
                  Tell BreakMyBot how the target API expects to be called.
                </h2>
              </div>

              <Button
                className="gap-2"
                onClick={() => setForm(exampleWorkspace)}
                size="sm"
                variant="secondary"
              >
                <RefreshCcw className="h-4 w-4" />
                Load example
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_9rem]">
              <Field label="Endpoint URL">
                <Input
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      endpointUrl: event.target.value,
                    }))
                  }
                  placeholder="https://api.example.com/v1/score"
                  value={form.endpointUrl}
                />
              </Field>

              <Field label="Method">
                <select
                  className="flex h-11 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none focus-visible:border-white/20 focus-visible:ring-2 focus-visible:ring-ring/40"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      method: event.target.value,
                    }))
                  }
                  value={form.method}
                >
                  {["POST", "PUT", "PATCH"].map((item) => (
                    <option className="bg-[#0b0d12]" key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <Field description="JSON object. Add auth tokens or any static headers the target needs." label="Headers">
                <Textarea
                  className="min-h-[180px]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      headersText: event.target.value,
                    }))
                  }
                  value={form.headersText}
                />
              </Field>

              <Field description="Short context so the agent knows what kind of endpoint it is testing." label="Endpoint notes">
                <Textarea
                  className="min-h-[180px] font-sans text-sm"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      endpointNotes: event.target.value,
                    }))
                  }
                  placeholder="Classifier, extractor, moderation endpoint, scorer, evaluator..."
                  value={form.endpointNotes}
                />
              </Field>
            </div>
          </section>

          <section className="panel p-6">
            <div className="space-y-2">
              <p className="label">Request contract</p>
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">
                Define the request shape and where the agent should inject probes.
              </h2>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
              <Field description="JSON body template sent to the target endpoint." label="Request template">
                <Textarea
                  className="min-h-[260px]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      requestTemplateText: event.target.value,
                    }))
                  }
                  value={form.requestTemplateText}
                />
              </Field>

              <div className="space-y-4">
                <Field description="Dot path inside the request body that receives each generated input." label="Variable path">
                  <Input
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        variablePath: event.target.value,
                      }))
                    }
                    placeholder="input.text"
                    value={form.variablePath}
                  />
                </Field>

                <Field description="One per line. These help the agent anchor its plan." label="Seed inputs">
                  <Textarea
                    className="min-h-[180px]"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        seedInputsText: event.target.value,
                      }))
                    }
                    value={form.seedInputsText}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="panel p-6">
            <div className="space-y-2">
              <p className="label">Response contract</p>
              <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">
                Optional response shape and behavior notes.
              </h2>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <Field description="Optional JSON schema subset used for basic validation." label="Response schema">
                <Textarea
                  className="min-h-[220px]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      responseSchemaText: event.target.value,
                    }))
                  }
                  placeholder='{"type":"object","required":["label"]}'
                  value={form.responseSchemaText}
                />
              </Field>

              <div className="space-y-4">
                <Field description="How the output should behave, beyond the raw schema." label="Response notes">
                  <Textarea
                    className="min-h-[170px] font-sans text-sm"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        responseNotes: event.target.value,
                      }))
                    }
                    placeholder="Stable label, valid JSON, no invented categories..."
                    value={form.responseNotes}
                  />
                </Field>

                <Field description="Higher counts give the agent more room to probe." label="Max cases">
                  <Input
                    max={12}
                    min={3}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        maxCases: Number(event.target.value || 6),
                      }))
                    }
                    type="number"
                    value={form.maxCases}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-[40rem] space-y-3">
              <p className="label">How the run works</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                  provider-backed planning
                </Badge>
                <Badge>
                  <Braces className="mr-2 h-3.5 w-3.5" />
                  request shape aware
                </Badge>
                <Badge>
                  <BadgeCheck className="mr-2 h-3.5 w-3.5" />
                  schema checks optional
                </Badge>
              </div>
              <p className="text-sm leading-7 text-white/54">
                The agent plans probes using your configured provider, injects
                them into the target request format, retries each case, and
                flags malformed responses, schema drift, and instability across
                retries.
              </p>
            </div>

            <Button
              className="gap-2"
              disabled={isPending || !providerSummary.configured}
              onClick={runAgent}
            >
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Launch run
            </Button>
          </section>
        </div>

        <ReportPanel report={report} statusMessage={statusMessage} />
      </section>
    </main>
  );
}

function Field({
  children,
  label,
  description,
}: {
  children: React.ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex flex-col gap-3">
      <div className="space-y-1">
        <p className="label">{label}</p>
        {description ? (
          <p className="text-sm leading-6 text-white/46">{description}</p>
        ) : null}
      </div>
      {children}
    </label>
  );
}
