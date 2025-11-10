import { BasePage } from "../bases/BasePage.js";
import type { Locator, Page } from '@playwright/test'


export class SwagLabsHomePage extends BasePage {
    private _usernameField = this.FindElement("#user-name");
    private _passwordField = this.FindElement("#password");
    private _loginButton = this.FindElement("#login-button");
    private _errorMessage = this.FindElement("div[class^='error-message-container']");
    private _loginLogo = this.FindElement(".login_logo");

    constructor (HomePage: Page){
        super(HomePage);
    }

    async setUsername (username : string) {
        await this.Set(this._usernameField, username)
    }

    async setPassword (password : string) {
        await this.Set(this._passwordField, password)
    }

    async getErrorMessage (): Promise<string> {
        return await this._errorMessage.textContent() || "";
    }

    async clickLoginButton (){
       await this.ClickOn(this._loginButton);
    }

    async checkForLoginLogo(){
        return await this._loginLogo.isVisible();
    }
}