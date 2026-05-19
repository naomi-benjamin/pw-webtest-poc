import { SwagLabsInventoryPage } from '../pages/SwagLabsInventoryPage.js';
import { Product } from '../fixtures/Product.js';

export class InventoryFacade {
    constructor(private inventoryPage: SwagLabsInventoryPage) {}

    async addItemToCart(product: Product): Promise<number> {
        await this.inventoryPage.addItemToCart(product);
        return this.inventoryPage.getCartBadgeValue();
    }

    async getCartCount(): Promise<number> {
        return this.inventoryPage.getCartBadgeValue();
    }

    async logOut() {
        await this.inventoryPage.openHamburgerMenu();
        await this.inventoryPage.clickLogoutButton();
    }
}
