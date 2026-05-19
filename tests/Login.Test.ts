import { unauthTest, expect } from '../src/fixtures/test-fixtures.js';
import { SwagLabsInventoryPage } from '../src/pages/SwagLabsInventoryPage.js';
import { SwagLabsHomePageErrorMessages as Errors } from '../src/fixtures/ErrorMessages.js';
import { TestUsers } from '../src/fixtures/Credentials.js';

unauthTest.describe("Login Tests", () => {

    unauthTest("Login with blank username and password shows correct error", async ({ homePage }) => {
        await homePage.clickLoginButton();
        expect((await homePage.getErrorMessage()).trim()).toBe(Errors.blankUsername);
    });

    unauthTest("Login with blank password shows the expected error", async ({ homePage }) => {
        await homePage.setUsername(TestUsers.standardUser.username);
        await homePage.clickLoginButton();
        expect((await homePage.getErrorMessage()).trim()).toBe(Errors.blankPassword);
    });

    unauthTest("Login with blank username shows the expected error", async ({ homePage }) => {
        await homePage.setPassword(TestUsers.standardUser.password);
        await homePage.clickLoginButton();
        expect((await homePage.getErrorMessage()).trim()).toBe(Errors.blankUsername);
    });

    unauthTest("Login with locked out user shows the expected error", async ({ loginFacade, homePage }) => {
        await loginFacade.login(TestUsers.lockedOutUser.username, TestUsers.lockedOutUser.password);
        expect((await homePage.getErrorMessage()).trim()).toBe(Errors.lockedOutError);
    });

    unauthTest("Login with incorrect password shows the expected error", async ({ loginFacade, homePage }) => {
        await loginFacade.login(TestUsers.incorrectPassword.username, TestUsers.incorrectPassword.password);
        expect((await homePage.getErrorMessage()).trim()).toBe(Errors.incorrectCredentials);
    });

    unauthTest("Login with standard user navigates to inventory page", async ({ loginFacade, homePage }) => {
        await loginFacade.loginAsStandardUser();
        const inventoryPage = new SwagLabsInventoryPage(homePage.page);
        expect(await inventoryPage.isVisible()).toBe(true);
    });

});
