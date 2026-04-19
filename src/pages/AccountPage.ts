import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  private readonly welcomeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeader = page.getByRole('heading', { level: 2 });
  }

  public async getWelcomeMessage(): Promise<string> {
    return this.welcomeHeader.innerText();
  }
}
