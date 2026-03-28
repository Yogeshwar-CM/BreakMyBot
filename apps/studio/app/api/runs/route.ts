import { NextRequest, NextResponse } from "next/server";

import { generateAgentPlan } from "@/lib/provider-client";
import { readRuntimeConfig } from "@/lib/runtime-config";
import { executePlan } from "@/lib/runner";
import type { ParsedStudioWorkspace, StudioFormInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  const { config } = await readRuntimeConfig();
  if (!config) {
    return NextResponse.json(
      {
        error: "Provider runtime is missing. Run `breakmybot setup` first.",
      },
      { status: 400 },
    );
  }

  const body = (await request.json()) as StudioFormInput;

  try {
    const workspace = parseWorkspace(body);
    const plan = await generateAgentPlan(workspace, config);
    const report = await executePlan(workspace, plan, config);
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to run the agent.",
      },
      { status: 400 },
    );
  }
}

function parseWorkspace(input: StudioFormInput): ParsedStudioWorkspace {
  const endpointUrl = requireString(input.endpointUrl, "endpointUrl");
  const method = requireString(input.method, "method").toUpperCase();
  const variablePath = requireString(input.variablePath, "variablePath");
  const endpointNotes = input.endpointNotes?.trim() ?? "";
  const responseNotes = input.responseNotes?.trim() ?? "";
  const maxCases = Number.isFinite(input.maxCases)
    ? Math.min(12, Math.max(3, Math.floor(input.maxCases)))
    : 6;

  const headers = input.headersText.trim()
    ? parseObjectJson(input.headersText, "headersText")
    : {};
  const requestTemplate = parseObjectJson(
    input.requestTemplateText,
    "requestTemplateText",
  );
  const responseSchema = input.responseSchemaText.trim()
    ? parseObjectJson(input.responseSchemaText, "responseSchemaText")
    : null;
  const seedInputs = input.seedInputsText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    endpointUrl,
    method,
    headers: objectAsStringMap(headers, "headersText"),
    requestTemplate,
    variablePath,
    seedInputs,
    endpointNotes,
    responseSchema,
    responseNotes,
    maxCases,
  };
}

function parseObjectJson(source: string, fieldName: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch (error) {
    throw new Error(`${fieldName} must be valid JSON. ${String(error)}`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`${fieldName} must be a JSON object.`);
  }

  return parsed;
}

function objectAsStringMap(value: Record<string, unknown>, fieldName: string) {
  const result: Record<string, string> = {};

  for (const [key, item] of Object.entries(value)) {
    if (typeof item !== "string") {
      throw new Error(`${fieldName} values must all be strings.`);
    }

    result[key] = item;
  }

  return result;
}

function requireString(value: string, fieldName: string) {
  if (!value || !value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
