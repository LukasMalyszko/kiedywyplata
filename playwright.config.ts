import { defineConfig, devices } from '@playwright/test';

/** Set `PW_FULL_MATRIX=1` to run Firefox, WebKit and mobile projects (needs OS libs, e.g. `playwright install --with-deps`). Default is Chromium only so `npm run test:e2e` works on minimal Linux/WSL. */
const fullMatrix = process.env.PW_FULL_MATRIX === '1';

const projects = fullMatrix
  ? [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
      { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
    ]
  : [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects,

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});