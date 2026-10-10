import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:5173",
    browserName: "chromium",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "npm run dev",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: false,
    },
    {
      command:
        "uv run --project ../backend --locked uvicorn app.main:create_app --factory --app-dir ../backend --host 127.0.0.1 --port 8000 --no-access-log",
      url: "http://127.0.0.1:8000/ready",
      env: { INSYNC_ENVIRONMENT: "test" },
      reuseExistingServer: false,
    },
  ],
});
