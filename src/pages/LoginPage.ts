import type { Locator, Page } from '@playwright/test';
import type { UserCredentials } from '../types/auth.types';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('input[type="submit"]');
  }

  public async goto(): Promise<void> {
    await super.goto('login');
    await this.waitForReady();
  }

  public async waitForReady(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
  }

  public async login(credentials: UserCredentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }
}
