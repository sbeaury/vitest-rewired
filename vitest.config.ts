import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from 'path'
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        projects: [
            {
                // Inherit the options from the root config
                extends: true,
                test: {
                    include: ["**/*.browser.test.{tsx,jsx}"],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: "chromium" }],
                    },
                    name: "happy-dom",
                    environment: "happy-dom",
                },
            },
            {
                test: {
                    include: ["**/*.node.test.{ts,js}"],
                    name: { label: "node", color: "green" },
                    environment: "node",
                },
            },
        ],
    },
});
