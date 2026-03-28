import type { AgentPlan, ParsedStudioWorkspace, RuntimeConfig } from "@/lib/types";

const SYSTEM_PROMPT = `
You are BreakMyBot's planning agent.

You generate targeted attack cases for a single-call AI API.
Your job is to think like a careful adversarial tester, not a generic prompt mutator.

Return strict JSON with this exact shape:
{
  "objective": "short string",
  "attackFamilies": ["string"],
  "cases": [
    {
      "name": "short string",
      "inputValue": "string payload to inject into the request variable path",
      "reasoning": "why this case matters",
      "focus": "what failure mode this case is targeting"
    }
  ]
}

Rules:
- Generate at most the requested number of cases.
- Cases should be specific to the target endpoint, not generic filler.
- Prefer edge cases, schema pressure, ambiguity, contradiction, malformed structure, and tiny wording shifts.
- The only field you directly control is inputValue.
- Do not include markdown fences.
`.trim();

export async function generateAgentPlan(
  workspace: ParsedStudioWorkspace,
  runtimeConfig: RuntimeConfig,
): Promise<AgentPlan> {
  try {
    const raw = await callProvider(runtimeConfig, buildPlanningPrompt(workspace));
    return {
      ...parseAgentPlan(raw, workspace.maxCases),
      providerMode: "live",
      providerNotes: `${runtimeConfig.provider} planned the run using ${runtimeConfig.model}.`,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Provider planning failed.";

    return {
      objective: "Pressure-test the endpoint for brittle input handling and response reliability.",
      attackFamilies: fallbackAttackFamilies(workspace),
      cases: buildFallbackCases(workspace),
      providerMode: "fallback",
      providerNotes: `Live provider planning failed, so BreakMyBot used a local fallback plan. ${message}`,
    };
  }
}

async function callProvider(runtimeConfig: RuntimeConfig, prompt: string) {
  if (runtimeConfig.provider === "anthropic") {
    return callAnthropic(runtimeConfig, prompt);
  }

  return callOpenAICompatible(runtimeConfig, prompt);
}

async function callOpenAICompatible(runtimeConfig: RuntimeConfig, prompt: string) {
  const response = await fetch(`${runtimeConfig.base_url}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${runtimeConfig.api_key}`,
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Provider returned ${response.status} for planning.`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Provider did not return usable planning content.");
  }

  return content;
}

async function callAnthropic(runtimeConfig: RuntimeConfig, prompt: string) {
  const response = await fetch(`${runtimeConfig.base_url}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": runtimeConfig.api_key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: runtimeConfig.model,
      max_tokens: 1400,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Provider returned ${response.status} for planning.`);
  }

  const data = await response.json();
  const content = data?.content?.find(
    (item: { type?: string; text?: string }) => item.type === "text",
  )?.text;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Provider did not return usable planning content.");
  }

  return content;
}

function buildPlanningPrompt(workspace: ParsedStudioWorkspace) {
  return [
    `Target endpoint URL: ${workspace.endpointUrl}`,
    `HTTP method: ${workspace.method}`,
    `Request variable path: ${workspace.variablePath}`,
    `Max cases: ${workspace.maxCases}`,
    `Headers: ${JSON.stringify(workspace.headers, null, 2)}`,
    `Request template: ${JSON.stringify(workspace.requestTemplate, null, 2)}`,
    `Seed inputs: ${JSON.stringify(workspace.seedInputs, null, 2)}`,
    `Endpoint notes: ${workspace.endpointNotes || "None provided."}`,
    `Expected response schema: ${
      workspace.responseSchema
        ? JSON.stringify(workspace.responseSchema, null, 2)
        : "No schema provided."
    }`,
    `Response notes: ${workspace.responseNotes || "None provided."}`,
  ].join("\n\n");
}

function parseAgentPlan(raw: string, maxCases: number) {
  const candidate = raw.trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Provider planning output did not contain valid JSON.");
  }

  const parsed = JSON.parse(candidate.slice(start, end + 1)) as {
    objective?: string;
    attackFamilies?: unknown;
    cases?: unknown;
  };

  const attackFamilies = Array.isArray(parsed.attackFamilies)
    ? parsed.attackFamilies.filter((item): item is string => typeof item === "string").slice(0, 6)
    : [];

  const cases = Array.isArray(parsed.cases)
    ? parsed.cases
        .filter(
          (
            item,
          ): item is { name?: string; inputValue?: string; reasoning?: string; focus?: string } =>
            typeof item === "object" && item !== null,
        )
        .map((item) => ({
          name: typeof item.name === "string" ? item.name : "Unnamed case",
          inputValue:
            typeof item.inputValue === "string"
              ? item.inputValue
              : "unexpected empty value",
          reasoning:
            typeof item.reasoning === "string"
              ? item.reasoning
              : "Agent did not provide reasoning.",
          focus:
            typeof item.focus === "string" ? item.focus : "general reliability",
        }))
        .slice(0, Math.max(1, maxCases))
    : [];

  if (!cases.length) {
    throw new Error("Provider planning output did not contain usable cases.");
  }

  return {
    objective:
      typeof parsed.objective === "string"
        ? parsed.objective
        : "Pressure-test the target endpoint before production.",
    attackFamilies: attackFamilies.length
      ? attackFamilies
      : fallbackAttackFamilies(undefined),
    cases,
  };
}

function fallbackAttackFamilies(workspace?: ParsedStudioWorkspace) {
  const families = [
    "semantic drift",
    "schema pressure",
    "boundary length",
    "format instability",
  ];

  if (workspace?.responseSchema) {
    families.push("response contract mismatch");
  }

  return families;
}

function buildFallbackCases(workspace: ParsedStudioWorkspace) {
  const seeds = workspace.seedInputs.length
    ? workspace.seedInputs
    : ["", "???", "Summarize this in one bullet."];

  const cases = seeds.flatMap((seed, index) => [
    {
      name: `Baseline ${index + 1}`,
      inputValue: seed,
      reasoning: "Baseline seed to anchor the run.",
      focus: "reference behavior",
    },
    {
      name: `Boundary ${index + 1}`,
      inputValue: `${seed} ${"very ".repeat(12)}long output stress`.trim(),
      reasoning: "Push the endpoint toward longer or noisier payload handling.",
      focus: "boundary length",
    },
    {
      name: `Punctuation ${index + 1}`,
      inputValue: `${seed}?!?!`,
      reasoning: "Check sensitivity to small surface-level changes.",
      focus: "surface instability",
    },
  ]);

  return cases.slice(0, Math.max(3, workspace.maxCases));
}
