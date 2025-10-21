import { test } from "@playwright/test";
import { BaseTest } from "../src/bases/BaseTest.js";

test.describe("Login Tests", () => {
    test("Blank username and password", async ({ page }) => {
        const base = new BaseTest();
        await base.setup(page);
        await base.swagLabsHomePage.clickLoginButton();
    });
});
