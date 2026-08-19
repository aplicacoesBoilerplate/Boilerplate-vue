import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './node_modules/.cache/playwright-test-results',
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  expect: {
    timeout: 120_000,
  },
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4174',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --mode test --host localhost --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
