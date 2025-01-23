import { LaunchOptions, chromium, firefox, webkit } from 'playwright';
import { config } from 'dotenv';  // Import dotenv to load the .env file

// Load environment variables from the .env file
config();

export class OptionsManager {
  /**
   * Get Chrome browser options.
   */
  public getChromeOptions(): LaunchOptions {
    const chromeOptions: LaunchOptions = {};

    if (this.isHeadless()) {
      console.log('====RUNNING TEST ON HEADLESS MODE====');
      chromeOptions.headless = true;
    }
    if (this.isIncognito()) {
      console.log('====RUNNING TEST ON INCOGNITO MODE====');
      chromeOptions.args = ['--incognito'];
    }
    if (this.isRemote()) {
      console.log('====RUNNING TEST ON REMOTE BROWSER====');
      chromeOptions.args = chromeOptions.args || [];
      chromeOptions.args.push('--remote-debugging-port=9222'); // Custom remote configuration
      // Add more remote configurations like Selenoid options if necessary
    }

    return chromeOptions;
  }

  /**
   * Get Firefox browser options.
   */
  public getFirefoxOptions(): LaunchOptions {
    const firefoxOptions: LaunchOptions = {};

    if (this.isHeadless()) {
      console.log('====RUNNING TEST ON HEADLESS MODE====');
      firefoxOptions.headless = true;
    }
    if (this.isIncognito()) {
      console.log('====RUNNING TEST ON INCOGNITO MODE====');
      firefoxOptions.args = ['--private'];
    }
    if (this.isRemote()) {
      console.log('====RUNNING TEST ON REMOTE BROWSER====');
      firefoxOptions.args = firefoxOptions.args || [];
      firefoxOptions.args.push('--remote-debugging-port=9222'); // Custom remote configuration
      // Add more remote configurations like Selenoid options if necessary
    }

    return firefoxOptions;
  }

  /**
   * Get Edge browser options.
   */
  public getEdgeOptions(): LaunchOptions {
    const edgeOptions: LaunchOptions = {};

    if (this.isHeadless()) {
      console.log('====RUNNING TEST ON HEADLESS MODE====');
      edgeOptions.headless = true;
    }
    if (this.isIncognito()) {
      console.log('====RUNNING TEST ON INCOGNITO MODE====');
      edgeOptions.args = ['--inPrivate'];
    }
    if (this.isRemote()) {
      console.log('====RUNNING TEST ON REMOTE BROWSER====');
      edgeOptions.args = edgeOptions.args || [];
      edgeOptions.args.push('--remote-debugging-port=9222'); // Custom remote configuration
    }

    return edgeOptions;
  }

  /**
   * Check if headless mode is enabled in the environment variable.
   */
  private isHeadless(): boolean {
    return Boolean(process.env.HEADLESS);  // Accessing the environment variable
  }


  private isIncognito(): boolean {
    return process.env.HEADLESS === 'true';
  }
  
  private isRemote(): boolean {
    return process.env.REMOTE === 'true';
  }
}
