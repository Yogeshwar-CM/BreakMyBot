import { AlertTriangle, CheckCircle2, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RunReport } from "@/lib/types";

type ReportPanelProps = {
  report: RunReport | null;
  statusMessage: string;
};

export function ReportPanel({ report, statusMessage }: ReportPanelProps) {
  if (!report) {
    return (
      <section className="panel flex min-h-[44rem] flex-col justify-between p-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <p className="label">Agent report</p>
            <Badge variant="default">waiting</Badge>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              The local studio will show how BreakMyBot thinks.
            </h2>
            <p className="max-w-[28rem] text-sm leading-7 text-white/58">
              Once you run the agent, this panel fills with planned attack
              families, probe results, schema issues, malformed payloads, and
              retry instability.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/58">
            <div className="code-block px-4 py-3">
              1. Agent plans attacks using your configured provider
            </div>
            <div className="code-block px-4 py-3">
              2. Studio injects inputs into your target request format
            </div>
            <div className="code-block px-4 py-3">
              3. BreakMyBot probes the endpoint and compiles failures
            </div>
          </div>
        </div>

        <p className="text-sm leading-7 text-white/44">{statusMessage}</p>
      </section>
    );
  }

  return (
    <section className="panel min-h-[44rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="label">Agent report</p>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
            {report.objective}
          </h2>
        </div>
        <Badge variant={report.provider.mode === "live" ? "success" : "warning"}>
          {report.provider.mode === "live" ? "live plan" : "fallback plan"}
        </Badge>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Total cases"
          value={String(report.summary.totalCases)}
        />
        <Metric
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Failed cases"
          value={String(report.summary.failedCases)}
        />
        <Metric
          icon={<Zap className="h-4 w-4" />}
          label="Instability"
          value={String(report.summary.instabilitySignals)}
        />
        <Metric
          icon={<Sparkles className="h-4 w-4" />}
          label="Schema issues"
          value={String(report.summary.schemaFailures)}
        />
      </div>

      <div className="mt-8 space-y-3">
        <p className="label">Attack families</p>
        <div className="flex flex-wrap gap-2">
          {report.attackFamilies.map((item) => (
            <Badge key={item} variant="accent">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {report.cases.map((item) => (
          <article className="rounded-[1.35rem] border border-white/10 bg-black/20 p-5" key={item.name}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">{item.name}</h3>
                <p className="text-sm leading-7 text-white/54">{item.reasoning}</p>
              </div>
              <Badge variant={item.failed ? "warning" : "success"}>
                {item.failed ? "issue found" : "stable"}
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="space-y-3">
                <p className="label">Injected input</p>
                <pre className="code-block overflow-x-auto px-4 py-3 text-white/82">
                  {item.inputValue}
                </pre>
                <div className="flex flex-wrap gap-2">
                  <Badge>{item.focus}</Badge>
                  {item.unstableAcrossRetries ? (
                    <Badge variant="warning">retry drift</Badge>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3">
                <p className="label">Probe attempts</p>
                <div className="grid gap-3">
                  {item.attempts.map((attempt, index) => (
                    <div className="code-block px-4 py-3" key={`${item.name}-${index}`}>
                      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/42">
                        Attempt {index + 1}
                      </p>
                      <p className="mt-2 text-white/72">
                        status: {attempt.status ?? "error"} · latency: {attempt.latencyMs}ms
                      </p>
                      {attempt.error ? (
                        <p className="mt-2 text-amber-200">{attempt.error}</p>
                      ) : (
                        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-white/78">
                          {attempt.responseText || "<empty response>"}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {item.schemaIssues.length ? (
              <div className="mt-4 rounded-[1rem] border border-amber-400/20 bg-amber-400/8 px-4 py-3 text-sm leading-7 text-amber-100">
                {item.schemaIssues.join(" ")}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <p className="label">Notes</p>
        <div className="space-y-2 text-sm leading-7 text-white/56">
          {report.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="flex items-center gap-2 text-white/46">{icon}</div>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-white/48">{label}</p>
    </div>
  );
}
