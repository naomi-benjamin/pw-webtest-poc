import { BasePage } from '../bases/BasePage.js';
import { Product } from '../fixtures/Product.js';
import type { Page } from '@playwright/test';

export class SwagLabsInventoryPage extends BasePage {
    private hamburgerMenuButton = this.page.locator('#react-burger-menu-btn');
    private inventoryHeader = this.page.locator("div[data-test='secondary-header']");
    private cartBadge = this.page.locator("[data-test='shopping-cart-badge']");
    private cartButton = this.page.locator('#shopping_cart_container');
    private logoutButton = this.page.locator('#logout_sidebar_link');

    constructor(page: Page) {
        super(page);
    }

    getAddToCartButton(product: Product) {
        return this.page.locator(`#add-to-cart-${product}`);
    }

    async isVisible(): Promise<boolean> {
        return this.inventoryHeader.isVisible();
    }

    async addItemToCart(product: Product) {
        await this.getAddToCartButton(product).click();
    }

    async getCartBadgeValue(): Promise<number> {
        const isVisible = await this.cartBadge.isVisible();
        if (!isVisible) return 0;
        const value = await this.cartBadge.textContent();
        return parseInt(value!.trim(), 10);
    }

    async openCart() {
        await this.cartButton.click();
    }

    async openHamburgerMenu() {
        await this.hamburgerMenuButton.click();
    }

    async clickLogoutButton() {
        await this.logoutButton.click();
    }
}
