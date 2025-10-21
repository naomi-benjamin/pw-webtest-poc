import { BasePage } from '../bases/BasePage.js';
import type { Locator, Page } from '@playwright/test';

export class SwagLabsInventoryPage extends BasePage {
    private _hamburgerMenuButton = this.FindElement("#react-burger-menu-btn");
    private _inventoryPage = this.FindElement("div[data-test='secondary-header']");
    private _cartButton = this.FindElement("#shopping_cart_container")

    constructor (InventoryPage: Page){
        super (InventoryPage);
    }

    async isInventoryPageDisplayed() {
        return await this._inventoryPage.isVisible();
    }
}