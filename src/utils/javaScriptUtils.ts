import { Page, Locator } from 'playwright';

export class JavaScriptUtil {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getTitleByJs(): Promise<string> {
    return this.page.evaluate(() => document.title);
  }

  async getURLByJs(): Promise<string> {
    return this.page.evaluate(() => document.URL);
  }

  async generateJSAlert(message: string): Promise<void> {
    await this.page.evaluate((msg) => alert(msg), message);
    await this.page.waitForTimeout(500); // Simulates the delay
    // No need to accept alerts in Playwright, as alerts are auto-handled.
  }

  async generateJSConfirm(message: string): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.page.evaluate((msg) => confirm(msg), message);
    await this.page.waitForTimeout(500);
  }

  async generateJSPrompt(message: string, value: string): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept(value);
    });
    await this.page.evaluate((msg) => prompt(msg), message);
    await this.page.waitForTimeout(500);
  }

  async goBackWithJS(): Promise<void> {
    await this.page.evaluate(() => history.go(-1));
  }

  async goForwardWithJS(): Promise<void> {
    await this.page.evaluate(() => history.go(1));
  }

  async pageRefreshWithJS(): Promise<void> {
    await this.page.evaluate(() => history.go(0));
  }

  async getPageInnerText(): Promise<string> {
    return this.page.evaluate(() => document.documentElement.innerText);
  }

  async scrollMiddlePageDown(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
  }

  async scrollFullPageDown(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  async scrollPageDown(height: string): Promise<void> {
    await this.page.evaluate((h) => {
      window.scrollTo(0, parseInt(h, 10));
    }, height);
  }

  async scrollPageUp(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(document.body.scrollHeight, 0);
    });
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async zoomFirefoxChromeEdgeSafari(zoomPercentage: string): Promise<void> {
    await this.page.evaluate((zoom) => {
      document.body.style.zoom = `${zoom}%`;
    }, zoomPercentage);
  }

  
  async drawBorder(locator: Locator): Promise<void> {
    await locator.evaluate((element) => {
      (element as HTMLElement).style.border = '3px solid red';
    });
  }

  async flash(locator: Locator): Promise<void> {
    const bgcolor = await locator.evaluate((element) =>
      window.getComputedStyle(element).backgroundColor
    );
    for (let i = 0; i < 7; i++) {
      await this.changeColor('rgb(0,200,0)', locator);
      await this.changeColor(bgcolor, locator);
    }
  }

  private async changeColor(color: string, locator: Locator): Promise<void> {
    await locator.evaluate((element, colorValue) => {
      (element as HTMLElement).style.backgroundColor = colorValue;
    }, color);
    await this.page.waitForTimeout(20);
  }

  async clickElementByJS(locator: Locator): Promise<void> {
    await locator.evaluate((element) => (element as HTMLElement).click());
  }

  async sendKeysUsingWithId(id: string, value: string): Promise<void> {
    await this.page.evaluate(
      (args) => {
        const [elementId, inputValue] = args;
        const element = document.getElementById(elementId) as HTMLInputElement;
        if (element) element.value = inputValue;
      },
      [id, value]
    );
  }
}
