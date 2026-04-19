import { test as base, expect } from "@playwright/test";
import { AccountPage } from "../pages/AccountPage";
import { LoginPage } from "../pages/LoginPage";
import { getUserByRole } from "../test-data/auth.data";
import type { TestUser, UserCredentials } from "../types/auth.types";
import { Logger } from "../utils/Logger";

const logger = new Logger("Fixtures");

type Fixtures = {
  /** Full credentials — internal use only. Password must not leak to tests. */
  _userCredentials: UserCredentials;
  /** User data safe to use in tests: username and role only. */
  credentials: TestUser;
  accountPage: AccountPage;
};

type Options = { userRole: string };

export const test = base.extend<Fixtures, Options>({
  userRole: ["standard", { scope: "worker", option: true }],

  _userCredentials: async ({ userRole }, use) => {
    await use(getUserByRole(userRole));
  },

  credentials: async ({ _userCredentials }, use) => {
    const { username, role } = _userCredentials;
    await use({ username, role });
  },

  accountPage: async ({ page, _userCredentials: user }, use) => {
    const userContext = `role: ${user.role}, username: ${user.username}`;
    logger.info(`Initialising session for ${userContext}`);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user);

    await use(new AccountPage(page));
    logger.info(`Session for ${userContext} completed`);
  },
});

export { expect };
