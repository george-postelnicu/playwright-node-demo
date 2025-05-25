import {defineConfig, devices} from '@playwright/test';
import path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const STORAGE: string = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'github' : 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'https://www.lucanet.com/en',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        screenshot: 'on',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {name: 'setup', testMatch: '**/init.setup.ts'},
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: STORAGE,
                viewport: {width: 1920, height: 1080},
            },
            dependencies: ['setup'],
        },
    ],
});
