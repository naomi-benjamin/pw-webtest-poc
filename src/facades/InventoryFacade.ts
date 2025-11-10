import type { BaseTest } from "../bases/BaseTest.js";
import { SwagLabsInventoryPage } from "../pages/SwagLabsInventoryPage.js";
import type { Locator } from "playwright/test";



export class InventoryFacade {
    private base: BaseTest;
    private inventoryPage: SwagLabsInventoryPage;

    constructor (base: BaseTest, inventoryPage: SwagLabsInventoryPage){
        this.base = base;
        this.inventoryPage =  inventoryPage;
    }

    async AddItemToCart(item: Locator){
        await this.inventoryPage.addItemToCart(item);
        return await this.inventoryPage.getCartBadgeValue();
    }

    async CheckCartCount(){
        return this.inventoryPage.getCartBadgeValue();
    }

    async LogOut(){
        await this.inventoryPage.openHamburgerMenu();
        await this.inventoryPage.clickLogoutButton();
    }
}