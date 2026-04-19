import * as fs from 'fs';
import * as path from 'path';

interface EnvConfig {
  defaultEnvironment: string;
  environments: Record<string, string>;
}

function loadConfig(): EnvConfig {
  const configPath = path.resolve(process.cwd(), 'config', 'env.config.json');
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw) as EnvConfig;
}

/**
 * Resolves the active environment name.
 *
 * Priority (highest → lowest):
 *   1. TEST_ENV environment variable (set via shell or .env file)
 *   2. defaultEnvironment in config/env.config.json
 */
export function resolveEnvironmentName(): string {
  const config = loadConfig();
  return process.env['TEST_ENV'] ?? config.defaultEnvironment;
}

/**
 * Resolves the base URL for the active environment.
 * Throws if the resolved environment name is not defined in config.
 */
export function resolveBaseUrl(): string {
  const config = loadConfig();
  const envName = resolveEnvironmentName();
  const baseUrl = config.environments[envName];

  if (!baseUrl) {
    const available = Object.keys(config.environments).join(', ');
    throw new Error(
      `Unknown environment "${envName}". Available environments: ${available}`
    );
  }

  return baseUrl;
}
