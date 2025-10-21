import { SwagLabsHomePage } from "../pages/SwagLabsHomePage.js";
import { BasePage } from "./BasePage.js";
import type { Page } from "@playwright/test";

export class BaseTest {
  public swagLabsHomePage!: SwagLabsHomePage;
  protected basePage!: BasePage;
  private readonly _url = "https://www.saucedemo.com/";

  async setup(page: Page) {
    await page.goto(this._url);
    this.basePage = new BasePage(page);
    this.swagLabsHomePage = new SwagLabsHomePage(page);
  }
}
