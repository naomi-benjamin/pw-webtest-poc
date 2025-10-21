import { SwagLabsHomePage } from "../pages/SwagLabsHomePage.js";
import type { Browser, Page } from "playwright/test";
import  { chromium } from "playwright/test";
import { BasePage } from "./BasePage.js";

export class BaseTest {
    protected browser!: Browser;
    public swagLabsHomePage!: SwagLabsHomePage;
    protected page!: Page;
    protected basePage!: BasePage;
    private readonly _url = "https://www.saucedemo.com/";

    async setup(){
        this.browser = await chromium.launch({headless: false});
        const context = await this.browser.newContext();
        this.page = await context.newPage();
        await this.page.goto(this._url);

        this.basePage = new BasePage(this.page);
        this.swagLabsHomePage = new SwagLabsHomePage(this.page);



    }

    async teardown(){
        await this.browser.close();
    }
}


