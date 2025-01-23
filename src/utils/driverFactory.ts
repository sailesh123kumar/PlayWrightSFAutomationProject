import { Browser, chromium, firefox, webkit, BrowserContext } from 'playwright';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env file
config();

export class DriverFactory {
    private static highlight: string;
    private static browserInstance: Browser | null = null;

    /**
     * This is used to initialize the driver based on the given browser name.
     */
    public async initDriver(): Promise<BrowserContext> {
        const browserName: string = process.env.BROWSER || 'chrome';
        const url: string = process.env.URL || 'http://localhost';
        DriverFactory.highlight = process.env.HIGHLIGHT || 'false';

        console.log('Browser name is : ' + browserName);

        const optionsManager = new OptionsManager();

        switch (browserName.trim().toLowerCase()) {
            case 'chrome':
                DriverFactory.browserInstance = process.env.REMOTE === 'true'
                    ? await this.initRemoteDriver('chrome')
                    : await chromium.launch(optionsManager.getChromeOptions());
                break;

            case 'firefox':
                DriverFactory.browserInstance = process.env.REMOTE === 'true'
                    ? await this.initRemoteDriver('firefox')
                    : await firefox.launch(optionsManager.getFirefoxOptions());
                break;

            case 'webkit':
                DriverFactory.browserInstance = process.env.REMOTE === 'true'
                    ? await this.initRemoteDriver('webkit')
                    : await webkit.launch(optionsManager.getWebkitOptions());
                break;

            default:
                console.log('Please pass the right browser name... :' + browserName);
                throw new Error('Browser not found');
        }

        const context = await DriverFactory.getBrowserInstance().newContext();
        const page = await context.newPage();
        await page.goto(url);
        await page.setViewportSize({ width: 1920, height: 1080 });

        return context;
    }

    /**
     * Initialize the remote driver to run tests on a remote (grid) machine.
     * @param browserName
     */
    private async initRemoteDriver(browserName: string): Promise<Browser> {
        console.log('Running it on GRID...With Browser: ' + browserName);

        const wsEndpoint = process.env.HUB_URL || 'http://localhost:4444';
        const optionsManager = new OptionsManager();

        switch (browserName.trim().toLowerCase()) {
            case 'chrome':
                return await chromium.connect({
                    wsEndpoint,
                    ...optionsManager.getChromeOptions(),
                });

            case 'firefox':
                return await firefox.connect({
                    wsEndpoint,
                    ...optionsManager.getFirefoxOptions(),
                });

            case 'webkit':
                return await webkit.connect({
                    wsEndpoint,
                    ...optionsManager.getWebkitOptions(),
                });

            default:
                console.log('Please pass the right browser name... :' + browserName);
                throw new Error('Browser not found');
        }
    }

    /**
     * Get the browser instance.
     */
    public static getBrowserInstance(): Browser {
        if (!DriverFactory.browserInstance) {
            throw new Error('Browser has not been initialized. Please call initDriver first.');
        }
        return DriverFactory.browserInstance;
    }

    /**
     * This method is used to initialize properties from environment variables.
     */
    public initProp(): void {
        const envName = process.env.ENV_NAME || 'qa'; // Default to 'qa' if not specified
        console.log('Running test suite on environment ---> ' + envName);

        // Configuration will be based on the environment
        switch (envName.trim().toLowerCase()) {
            case 'prod':
                console.log('Loading production configuration...');
                break;
            case 'qa':
                console.log('Loading QA configuration...');
                break;
            case 'uat':
                console.log('Loading UAT configuration...');
                break;
            case 'stage':
                console.log('Loading Stage configuration...');
                break;
            case 'dev':
                console.log('Loading Development configuration...');
                break;
            default:
                console.log('Please pass the right environment :' + envName);
                throw new Error('Invalid environment specified');
        }
    }

    /**
     * Take a screenshot.
     * @param methodName
     */
    public static async getScreenshot(methodName: string): Promise<string> {
        const browser = DriverFactory.getBrowserInstance();
        const context = await browser.newContext();
        const page = await context.newPage();

        const screenshotDirPath = path.join(process.cwd(), 'screenshots');
        if (!fs.existsSync(screenshotDirPath)) {
            fs.mkdirSync(screenshotDirPath);
        }

        const screenshotPath = path.join(screenshotDirPath, `${methodName}_${Date.now()}.png`);
        await page.screenshot({ path: screenshotPath });
        await context.close(); // Close the context after taking the screenshot

        return screenshotPath;
    }
}

// Mock class for OptionsManager, you can replace it with your actual implementation.
class OptionsManager {
    getChromeOptions() {
        return {};
    }

    getFirefoxOptions() {
        return {};
    }

    getWebkitOptions() {
        return {};
    }
}
