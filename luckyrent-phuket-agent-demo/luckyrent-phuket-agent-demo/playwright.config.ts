import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3111",
    trace: "off",
    screenshot: "only-on-failure",
    launchOptions: {
      // Low-memory sandbox: V8 jitless avoids the renderer CodeRange
      // reservation that otherwise OOMs next to the Next.js server.
      args: ["--js-flags=--jitless", "--disable-dev-shm-usage"],
    },
  },
  webServer: {
    command: "PORT=3111 npm run start",
    url: "http://localhost:3111",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
