import { test, performanceGlitchTest, expect } from '../src/fixtures/test-fixtures.js';
import { SwagLabsHomePage } from '../src/pages/SwagLabsHomePage.js';
import { Product } from '../src/fixtures/Product.js';

test.describe("Inventory Tests", () => {

    test("Add a single item to cart increments cart badge value", async ({ inventoryFacade }) => {
        const currentCount = await inventoryFacade.getCartCount();
        const newCount = await inventoryFacade.addItemToCart(Product.Backpack);
        expect(newCount).toEqual(currentCount + 1);
    });

    test("Logout from inventory page redirects to home page", async ({ inventoryFacade, page }) => {
        await inventoryFacade.logOut();
        const homePage = new SwagLabsHomePage(page);
        expect(await homePage.isVisible()).toBe(true);
    });

});

performanceGlitchTest.describe("Inventory Tests — Performance Glitch User", () => {

    performanceGlitchTest("Add a single item to cart increments cart badge value", async ({ inventoryFacade }) => {
        const currentCount = await inventoryFacade.getCartCount();
        const newCount = await inventoryFacade.addItemToCart(Product.Backpack);
        expect(newCount).toEqual(currentCount + 1);
    });

});
