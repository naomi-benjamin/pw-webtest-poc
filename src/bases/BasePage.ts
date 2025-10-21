import type { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    protected FindElement(locator: string) {
        return this.page.locator(locator)
    }

    protected async Set(locator: Locator, text: string) {
        await locator.fill(text);
    }

    protected async ClickOn(locator: Locator) {
        await locator.click({timeout: 5000});
    }
}
