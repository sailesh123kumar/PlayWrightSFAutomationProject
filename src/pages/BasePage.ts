import { Page } from '@playwright/test';
import { ElementUtil } from '../utils/elementUtils';

export class BasePage {
  protected page: Page;
  protected elementUtil: ElementUtil;

  constructor(page: Page) {
    this.page = page;
    this.elementUtil = new ElementUtil(page); // Initialize ElementUtil with the page instance
  }
}
