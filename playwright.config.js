// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], // This will show test results in the terminal
    ['html'], // Default HTML reporter
    ['./tests/CustomReporter.js', { outputFile: 'playwright-report.html' }], // Custom reporter
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 600000, // Maximum time one test can run

  use: {
    screenshot: 'only-on-failure', // Automatically take screenshots when test fails
    trace: 'on-first-retry',       // Collect trace on first retry
  },

  /* Configure projects for major browsers */
  projects: [
  {
    name: 'test-chromium',
    metadata: { env: 'test' }, 
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://votre-sante-test.powerappsportals.com',
      storageState: 'auth/storageState.test.json'
    },
  },
  {
    name: 'UAT-chromium',
    metadata: { env: 'uat' },
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://votre-sante-uat.powerappsportals.com',
      storageState: 'auth/storageState.uat.json'
    },
  },
  {
    name: 'dev-chromium',
    metadata: { env: 'dev' },
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://votre-sante-dev.powerappsportals.com',
      storageState: 'auth/storageState.dev.json'
    },
  },
  {
    name: 'int-chromium',
    metadata: { env: 'int' },
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://votre-sante-int.powerappsportals.com',
      storageState: 'auth/storageState.int.json'
    },
  }
]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});