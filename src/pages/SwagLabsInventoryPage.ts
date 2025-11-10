import { BasePage } from '../bases/BasePage.js';
import type { Locator, Page } from '@playwright/test';

export class SwagLabsInventoryPage extends BasePage {
    private _hamburgerMenuButton = this.FindElement("#react-burger-menu-btn");
    private _inventoryPage = this.FindElement("div[data-test='secondary-header']");
    private _cartButton = this.FindElement("#shopping_cart_container");
    private _cartBadgeValue = this.FindElement("[data-test='shopping-cart-badge']");
    private _filterButton = this.FindElement(".product_sort_container");
    private _logoutLocator = "#logout_sidebar_link";
    
    // Products
    public _addBackpackToCart = this.FindElement("#add-to-cart-sauce-labs-backpack");
    public _addBikeLightToCart = this.FindElement("#add-to-cart-sauce-labs-bike-light");
    public _addTshirtToCart = this.FindElement("#add-to-cart-sauce-labs-bolt-t-shirt");
    public _addJacketToCart = this.FindElement("#add-to-cart-sauce-labs-fleece-jacket");
    public _addOnesieToCart = this.FindElement("#add-to-cart-sauce-labs-onesie");
    public _addRedTshirtToCart = this.FindElement("#add-to-cart-test.allthethings()-t-shirt-(red)");


    constructor (InventoryPage: Page){
        super (InventoryPage);
    }

    async isInventoryPageDisplayed() {
        return await this._inventoryPage.isVisible();
    }

    async addItemToCart(locator: Locator){
        await this.ClickOn(locator);
    }

    async openHamburgerMenu(){
        return await this.ClickOn(this._hamburgerMenuButton);
    }

    async getCartBadgeValue(){
        const isCartBadgeVisible = await this._cartBadgeValue.isVisible()
        if (isCartBadgeVisible) {
             const badgeValue =  await this._cartBadgeValue.textContent();
             return parseInt(badgeValue!.trim(), 10);
        } else {
            return 0;
        }
    }

    async openCart(){
        await this.ClickOn(this._cartButton);
    }

    async clickLogoutButton(){
        const logoutButton = await this.FindElement(this._logoutLocator);
        await this.ClickOn(logoutButton);
    }
}