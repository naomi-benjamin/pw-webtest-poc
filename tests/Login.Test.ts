import { test, expect } from "@playwright/test";
import { SwagLabsHomePage } from "../src/pages/SwagLabsHomePage.js";
import { BaseTest } from "../src/bases/BaseTest.js";

test.describe("Login Tests", () => {
    let base: BaseTest;
    const _password = "secret_sauce"

    test.beforeEach(async () => {
        base = new BaseTest();
        await base.setup();
    });

    // test.afterEach(async () => {
    //     await base.teardown();
    // });

    test("Blank username and password", async () => {
        base.swagLabsHomePage.clickLoginButton();
        
    });
});