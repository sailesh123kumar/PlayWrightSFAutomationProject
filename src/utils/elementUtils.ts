

import { Locator, Page } from '@playwright/test';


export class ElementUtil {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
 
  }

  private async highlightElement(locator: Locator): Promise<void> {
    const elementHandle = await locator.elementHandle(); // Get the element handle
    if (elementHandle) {
      // Only proceed if the elementHandle is not null
      await this.page.evaluate((element) => {
        element.style.border = '2px solid red';
      }, elementHandle);
    } else {
      console.error('Element not found or detached from DOM');
    }
  }
  

  async getElement(selector: string): Promise<Locator> {
    const element = this.page.locator(selector);
    if (await element.count() === 0) {
      throw new Error(`Element not found for selector: ${selector}`);
    }
    await this.highlightElement(element);
    return element;
  }

  async enterText(selector: string, value: string): Promise<void> {
    const element = await this.getElement(selector);
    await element.fill('');
    await element.fill(value);
  }

  async click(selector: string): Promise<void> {
    const element = await this.getElement(selector);
    await element.click();
  }

  async getText(selector: string): Promise<string> {
    const element = await this.getElement(selector);
    return await element.textContent() || '';
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = await this.getElement(selector);
    return await element.getAttribute(attribute);
  }
  async isDisplayed(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      // Wait for the element to be visible within the specified timeout
      return await this.page.locator(selector).isVisible({ timeout });
    } catch (error) {
      // If timeout occurs or the element is not visible, return false
      return false;
    }
  }


    /**
   * Check if an element is enabled.
   * @param selector - The selector for the element.
   * @returns A promise that resolves to `true` if the element is enabled, otherwise `false`.
   */
    public async isEnabled(selector: string): Promise<boolean> {
      try {
        const element = this.page.locator(selector);
        const isEnabled = await element.isEnabled();
        console.log(`Element with selector "${selector}" is enabled: ${isEnabled}`);
        return isEnabled;
      } catch (error) {
        console.error(`Error checking if element with selector "${selector}" is enabled:`, error);
        return false;
      }
    }

  async getElements(selector: string): Promise<Locator[]> {
    return this.page.locator(selector).all();
  }

  async getElementsTextList(selector: string): Promise<string[]> {
    const elements = await this.getElements(selector);
    const texts: string[] = [];
    for (const element of elements) {
      const text = await element.textContent();
      if (text && text.trim().length > 0) {
        texts.push(text.trim());
      }
    }
    return texts;
  }

  async selectDropdownByValue(selector: string, value: string): Promise<void> {
    const element = await this.getElement(selector);
    await element.selectOption({ value });
  }

  async selectDropdownByVisibleText(selector: string, visibleText: string): Promise<void> {
    const element = await this.getElement(selector);
    const options = await element.locator('option').all();
    for (const option of options) {
      if ((await option.textContent())?.trim() === visibleText) {
        await option.click();
        break;
      }
    }
  }

  async waitForElementVisible(selector: string, timeout: number = 5000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  async waitForTitleContains(partialTitle: string, timeout: number = 5000): Promise<string> {
    await this.page.waitForFunction(
      (partial) => document.title.includes(partial),
      partialTitle,
      { timeout }
    );
    return this.page.title();
  }

  async waitForUrlContains(partialUrl: string, timeout: number = 5000): Promise<string> {
    await this.page.waitForFunction(
      (partial) => window.location.href.includes(partial),
      partialUrl,
      { timeout }
    );
    return this.page.url();
  }

  async handleAlert(action: 'accept' | 'dismiss', textToSend?: string): Promise<void> {
    this.page.on('dialog', async (dialog) => {
     
      if (action === 'accept' && textToSend !=null) {
        await dialog.accept(textToSend);
      } else if(action === 'accept'){
        await dialog.accept
      }
      else
      {
        await dialog.dismiss();
      }
    });
  }

  async switchToFrame(frameSelector: string): Promise<void> {
    const frame = this.page.frameLocator(frameSelector);
    if (!frame) {
      throw new Error(`Frame not found for selector: ${frameSelector}`);
    }
  }
}
