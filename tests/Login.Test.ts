import { expect, test } from "@playwright/test";
import { BaseTest } from "../src/bases/BaseTest.js";
import { SwagLabsHomePageErrorMessages } from "../src/fixtures/ErrorMessages.js";
import { TestUsers } from "../src/fixtures/Credentials.js";

test.describe("Login Tests", () => {
    let base!: BaseTest;

    test.beforeEach(async ({ page }) => {
        base = new BaseTest();
        await base.setup(page);
    });

    test("Login with blank username and password shows correct error", async () => {
        await base.swagLabsHomePage.clickLoginButton();
        let err = await base.swagLabsHomePage.getErrorMessage();

        expect(err.trim()).toBe(SwagLabsHomePageErrorMessages.blankUsername);
    });


    test("Login with blank password shows the expected error", async () => {
        await base.swagLabsHomePage.setUsername(TestUsers.standardUser.username);
        await base.swagLabsHomePage.clickLoginButton();
        let err = await base.swagLabsHomePage.getErrorMessage();

        expect(err.trim()).toBe(SwagLabsHomePageErrorMessages.blankPassword)
    });

    test("Login with locked out user shows the expected error", async () => {
        await base.swagLabsHomePage.setUsername(TestUsers.lockedOutUser.username);
        await base.swagLabsHomePage.setPassword(TestUsers.lockedOutUser.password);
        await base.swagLabsHomePage.clickLoginButton();
        let err = await base.swagLabsHomePage.getErrorMessage();

        expect(err.trim()).toBe(SwagLabsHomePageErrorMessages.lockedOutError)
    });
});
