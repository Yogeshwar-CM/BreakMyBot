import { validateSchema } from "@/lib/schema";
import type {
  AgentPlan,
  ParsedStudioWorkspace,
  ProbeAttempt,
  ProbeCaseReport,
  RunReport,
  RuntimeConfig,
} from "@/lib/types";

export async function executePlan(
  workspace: ParsedStudioWorkspace,
  plan: AgentPlan,
  runtimeConfig: RuntimeConfig,
): Promise<RunReport> {
  const caseReports: ProbeCaseReport[] = [];

  for (const testCase of plan.cases) {
    caseReports.push(await runCase(workspace, testCase));
  }

  const schemaFailures = caseReports.filter((item) => item.schemaIssues.length > 0).length;
  const malformedResponses = caseReports.filter((item) =>
    item.attempts.some((attempt) => attempt.malformedJson),
  ).length;
  const instabilitySignals = caseReports.filter((item) => item.unstableAcrossRetries).length;
  const failedCases = caseReports.filter((item) => item.failed).length;

  const notes = [plan.providerNotes];
  if (!workspace.responseSchema) {
    notes.push("No response schema was provided, so validation was limited to transport and parse checks.");
  }

  return {
    provider: {
      name: runtimeConfig.provider,
      model: runtimeConfig.model,
      mode: plan.providerMode,
    },
    objective: plan.objective,
    attackFamilies: plan.attackFamilies,
    endpoint: {
      url: workspace.endpointUrl,
      method: workspace.method,
    },
    summary: {
      totalCases: caseReports.length,
      failedCases,
      schemaFailures,
      malformedResponses,
      instabilitySignals,
    },
    cases: caseReports,
    notes,
  };
}

async function runCase(
  workspace: ParsedStudioWorkspace,
  testCase: AgentPlan["cases"][number],
) {
  const attempts = await Promise.all([
    executeAttempt(workspace, testCase.inputValue),
    executeAttempt(workspace, testCase.inputValue),
  ]);

  const unstableAcrossRetries = normalizedResponse(attempts[0]) !== normalizedResponse(attempts[1]);
  const schemaIssues =
    workspace.responseSchema && attempts[0].parsedJson !== null
      ? validateSchema(attempts[0].parsedJson, workspace.responseSchema)
      : [];
  const failed =
    attempts.some((attempt) => !attempt.ok || attempt.malformedJson || attempt.error) ||
    unstableAcrossRetries ||
    schemaIssues.length > 0;

  return {
    name: testCase.name,
    focus: testCase.focus,
    reasoning: testCase.reasoning,
    inputValue: testCase.inputValue,
    attempts,
    schemaIssues,
    unstableAcrossRetries,
    failed,
  } satisfies ProbeCaseReport;
}

async function executeAttempt(workspace: ParsedStudioWorkspace, inputValue: string) {
  const startedAt = Date.now();
  const requestBody = injectInputValue(
    workspace.requestTemplate,
    workspace.variablePath,
    inputValue,
  );

  try {
    const response = await fetch(workspace.endpointUrl, {
      method: workspace.method,
      headers: {
        "Content-Type": "application/json",
        ...workspace.headers,
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(20_000),
    });

    const responseText = (await response.text()).slice(0, 4_000);
    const parsedJson = safeParseJson(responseText);

    return {
      ok: response.ok,
      status: response.status,
      latencyMs: Date.now() - startedAt,
      responseText,
      parsedJson: parsedJson.value,
      malformedJson: parsedJson.malformed,
      error: null,
    } satisfies ProbeAttempt;
  } catch (error) {
    return {
      ok: false,
      status: null,
      latencyMs: Date.now() - startedAt,
      responseText: "",
      parsedJson: null,
      malformedJson: false,
      error: error instanceof Error ? error.message : "Unknown request failure",
    } satisfies ProbeAttempt;
  }
}

function injectInputValue(
  template: Record<string, unknown>,
  variablePath: string,
  inputValue: string,
) {
  const clone = structuredClone(template);
  const parts = variablePath.split(".").filter(Boolean);

  if (!parts.length) {
    throw new Error("Variable path is empty.");
  }

  let current: Record<string, unknown> = clone;
  for (const part of parts.slice(0, -1)) {
    if (typeof current[part] !== "object" || current[part] === null || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = inputValue;
  return clone;
}

function safeParseJson(text: string) {
  if (!text.trim()) {
    return {
      value: null,
      malformed: false,
    };
  }

  try {
    return {
      value: JSON.parse(text) as unknown,
      malformed: false,
    };
  } catch {
    return {
      value: null,
      malformed: true,
    };
  }
}

function normalizedResponse(attempt: ProbeAttempt) {
  if (attempt.error) {
    return `error:${attempt.error}`;
  }

  if (attempt.parsedJson !== null) {
    return JSON.stringify(sortKeys(attempt.parsedJson));
  }

  return attempt.responseText.trim();
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, sortKeys(item)]),
    );
  }

  return value;
}
