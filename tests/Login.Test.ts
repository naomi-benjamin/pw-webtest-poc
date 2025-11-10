import { expect, test } from "@playwright/test";
import { BaseTest } from "../src/bases/BaseTest.js";
import { SwagLabsHomePageErrorMessages as Errors } from "../src/fixtures/ErrorMessages.js";
import { TestUsers } from "../src/fixtures/Credentials.js";
import { LoginFacade } from "../src/facades/LoginFacade.js";
import { SwagLabsInventoryPage } from "../src/pages/SwagLabsInventoryPage.js";

test.describe("Login Tests", () => {
    let base!: BaseTest;
    let loginFacade!: LoginFacade;
    let swagLabsInventoryPage!: SwagLabsInventoryPage;

    test.beforeEach(async ({ page }) => {
        base = new BaseTest();
        await base.setup(page);
        loginFacade = new LoginFacade(base);
        swagLabsInventoryPage = new SwagLabsInventoryPage(page);
    });

    test("Login with blank username and password shows correct error", async () => {
        await base.swagLabsHomePage.clickLoginButton();
        loginFacade.ExpectLoginFailure(Errors.blankUsername);
    });


    test("Login with blank password shows the expected error", async () => {
        await base.swagLabsHomePage.setUsername(TestUsers.standardUser.username);
        await base.swagLabsHomePage.clickLoginButton();
        loginFacade.ExpectLoginFailure(Errors.blankPassword);
    });

    test("Login with blank username shows the expected error", async () => {
        await base.swagLabsHomePage.setPassword(TestUsers.standardUser.password);
        await base.swagLabsHomePage.clickLoginButton();
        loginFacade.ExpectLoginFailure(Errors.blankUsername);
    });

    test("Login with locked out user shows the expected error", async () => {
        await loginFacade.Login(TestUsers.lockedOutUser.username, TestUsers.lockedOutUser.password);
        loginFacade.ExpectLoginFailure(Errors.lockedOutError);
    });

    test("Login with incorrect password", async () => {
        await loginFacade.Login(TestUsers.incorrectPassword.username, TestUsers.incorrectPassword.password);
        loginFacade.ExpectLoginFailure(Errors.incorrectCredentials);
    
    });

    test("Login with standard user", async () => {
        await loginFacade.LoginAsStandardUser();
        const isLoggedIn = await swagLabsInventoryPage.isInventoryPageDisplayed();

        expect(isLoggedIn).toBe(true);
    });
});
