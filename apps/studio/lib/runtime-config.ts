import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { ProviderSummary, RuntimeConfig } from "@/lib/types";

function resolveRuntimeConfigPath() {
  return (
    process.env.BREAKMYBOT_CONFIG_PATH ??
    path.join(os.homedir(), ".config", "breakmybot", "runtime.json")
  );
}

export async function readRuntimeConfig() {
  const configPath = resolveRuntimeConfigPath();

  try {
    const raw = await fs.readFile(configPath, "utf-8");
    const parsed = JSON.parse(raw) as RuntimeConfig;
    return {
      configPath,
      config: parsed,
    };
  } catch {
    return {
      configPath,
      config: null,
    };
  }
}

export async function readProviderSummary(): Promise<ProviderSummary> {
  const { configPath, config } = await readRuntimeConfig();

  if (!config) {
    return {
      configured: false,
      provider: null,
      model: null,
      configPath,
    };
  }

  return {
    configured: true,
    provider: config.provider,
    model: config.model,
    configPath,
  };
}
