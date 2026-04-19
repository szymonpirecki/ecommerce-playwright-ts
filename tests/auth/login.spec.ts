import { expect, test } from "../../src/fixtures/index";

test.describe("Login Tests", () => {
  test(
    "Successful Login Test",
    { tag: ["@smoke", "@auth"] },
    async ({ accountPage, credentials }) => {
      const message = await accountPage.getWelcomeMessage();
      const expectedMessage = `Welcome, ${credentials.username}!`;

      expect(
        message,
        `Unexpected welcome message after login: ${message}`,
      ).toBe(expectedMessage);
    },
  );
});
