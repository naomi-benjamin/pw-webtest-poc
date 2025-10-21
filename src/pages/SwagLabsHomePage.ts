import { BasePage } from "../bases/BasePage.js";
import type { Locator, Page } from '@playwright/test'


export class SwagLabsHomePage extends BasePage {
    private _usernameField = this.FindElement("#user-name");
    private _passwordField = this.FindElement("#password");
    private _loginButton = this.FindElement("#login-button");
    private _errorMessage = this.FindElement("div[class^='error-message-container']");

    constructor (HomePage: Page){
        super(HomePage);
    }

    setUsername (username : string) {
        this.Set(this._usernameField, username)
    }

    setPassword (password : string) {
        this.Set(this._passwordField, password)
    }

    getErrorMessage (){
        return this.FindElement((this._errorMessage).toString());
    }

    async clickLoginButton (){
        //this._loginButton.waitFor({state: "visible", timeout: 5000})
       await this.ClickOn(this._loginButton);
    }
}