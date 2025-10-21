import type { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

     protected FindElement(locator: string) {
        return this.page.locator(locator)
    }

    protected Set(locator: Locator, text: string) {
        locator.fill(text);
    }

    protected async ClickOn(locator: Locator) {
        console.log(`Before clicking ${locator}`);
        //await locator.click({timeout: 5000});
        //console.log(`${this.page.getByPlaceholder('Username')}}`)
        await this.page.getByPlaceholder('Username').click();
        console.log(`After clicking ${locator}`);
    }
}
