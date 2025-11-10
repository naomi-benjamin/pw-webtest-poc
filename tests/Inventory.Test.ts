import { expect, test } from "@playwright/test";
import { BaseTest } from "../src/bases/BaseTest.js";
import { TestUsers } from "../src/fixtures/Credentials.js";
import { LoginFacade } from "../src/facades/LoginFacade.js";
import { SwagLabsInventoryPage } from "../src/pages/SwagLabsInventoryPage.js";
import { InventoryFacade } from "../src/facades/InventoryFacade.js";

test.describe("Inventory Tests", () => {
    let base!: BaseTest;
    let loginFacade!: LoginFacade;
    let swagLabsInventoryPage!: SwagLabsInventoryPage;
    let inventoryFacade!: InventoryFacade;

    test.beforeEach(async ({ page }) => {
        base = new BaseTest();
        await base.setup(page);
        loginFacade = new LoginFacade(base);
        swagLabsInventoryPage = new SwagLabsInventoryPage(page);
        inventoryFacade = new InventoryFacade(base, swagLabsInventoryPage);
    });

    test("Login and add a single item to cart increments cart badge value", async () => {
        await loginFacade.LoginAsStandardUser();
        const currentCount = await inventoryFacade.CheckCartCount();
        const count = await inventoryFacade.AddItemToCart(swagLabsInventoryPage._addBackpackToCart);

        expect(count).toEqual(currentCount + 1);
    });

    test("Login with standard user and logout", async () => {
        await loginFacade.LoginAsStandardUser();
        await inventoryFacade.LogOut();

        expect(await loginFacade.CheckIfHomePageIsVisible()).toBe(true);
    });
});