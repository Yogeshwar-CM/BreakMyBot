export type ProviderName = "openai" | "anthropic" | "groq";

export type RuntimeConfig = {
  provider: ProviderName;
  api_key: string;
  model: string;
  base_url: string;
  created_at: string;
  updated_at: string;
};

export type ProviderSummary = {
  configured: boolean;
  provider: ProviderName | null;
  model: string | null;
  configPath: string;
};

export type StudioFormInput = {
  endpointUrl: string;
  method: string;
  headersText: string;
  requestTemplateText: string;
  variablePath: string;
  seedInputsText: string;
  endpointNotes: string;
  responseSchemaText: string;
  responseNotes: string;
  maxCases: number;
};

export type ParsedStudioWorkspace = {
  endpointUrl: string;
  method: string;
  headers: Record<string, string>;
  requestTemplate: Record<string, unknown>;
  variablePath: string;
  seedInputs: string[];
  endpointNotes: string;
  responseSchema: Record<string, unknown> | null;
  responseNotes: string;
  maxCases: number;
};

export type AgentTestCase = {
  name: string;
  inputValue: string;
  reasoning: string;
  focus: string;
};

export type AgentPlan = {
  objective: string;
  attackFamilies: string[];
  cases: AgentTestCase[];
  providerMode: "live" | "fallback";
  providerNotes: string;
};

export type ProbeAttempt = {
  ok: boolean;
  status: number | null;
  latencyMs: number;
  responseText: string;
  parsedJson: unknown | null;
  malformedJson: boolean;
  error: string | null;
};

export type ProbeCaseReport = {
  name: string;
  focus: string;
  reasoning: string;
  inputValue: string;
  attempts: ProbeAttempt[];
  schemaIssues: string[];
  unstableAcrossRetries: boolean;
  failed: boolean;
};

export type RunReport = {
  provider: {
    name: ProviderName;
    model: string;
    mode: "live" | "fallback";
  };
  objective: string;
  attackFamilies: string[];
  endpoint: {
    url: string;
    method: string;
  };
  summary: {
    totalCases: number;
    failedCases: number;
    schemaFailures: number;
    malformedResponses: number;
    instabilitySignals: number;
  };
  cases: ProbeCaseReport[];
  notes: string[];
};
