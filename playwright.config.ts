import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import * as dotenv from 'dotenv';
import { resolveBaseUrl, resolveEnvironmentName } from './src/utils/envResolver';

const TEST_TIMEOUT_MS = 30_000;
const EXPECT_TIMEOUT_MS = 5_000;

// Load .env before resolving env config. dotenv will not override variables
// that are already set in the shell environment, which means a shell-exported
// TEST_ENV always wins over the value in the .env file.
dotenv.config();

const baseURL = resolveBaseUrl();
const environmentName = resolveEnvironmentName();

console.log(`Running tests against environment: "${environmentName}" → ${baseURL}`);

const reporters: ReporterDescription[] = [
  ['list'],
  ['allure-playwright', {
    outputFolder: 'allure-results',
    environmentInfo: {
      environment: process.env['TEST_ENV'] ?? 'local',
      base_url: baseURL,
      node_version: process.version,
    },
  }],
];


export default defineConfig({
  testDir: './tests',
  timeout: TEST_TIMEOUT_MS,
  expect: { timeout: EXPECT_TIMEOUT_MS },
  fullyParallel: true,
  // Fail fast on accidental .only calls in CI
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: reporters,

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
