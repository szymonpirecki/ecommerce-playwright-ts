import type { Page } from '@playwright/test';
import { resolveBaseUrl } from '../utils/envResolver';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigate to a path relative to the resolved base URL.
   * Subclasses call this with their own path — URL resolution stays in envResolver.
   */
  protected async goto(path: string): Promise<void> {
    await this.page.goto(`${resolveBaseUrl()}${path}`);
    await this.waitForPageLoad();
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

}