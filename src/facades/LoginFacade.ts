import { expect } from "playwright/test";
import { BaseTest } from "../bases/BaseTest.js";
import { TestUsers } from "../fixtures/Credentials.js";
import { SwagLabsInventoryPage } from "../pages/SwagLabsInventoryPage.js";

export class LoginFacade {
    private base: BaseTest;

    constructor (base: BaseTest){
        this.base = base;
    }

    async LoginAsStandardUser(){
        const user = TestUsers.standardUser;
        await this.base.swagLabsHomePage.setUsername(user.username);
        await this.base.swagLabsHomePage.setPassword(user.password);
        await this.base.swagLabsHomePage.clickLoginButton();
    }

    async Login(username: string, password: string){
        await this.base.swagLabsHomePage.setUsername(username);
        await this.base.swagLabsHomePage.setPassword(password);
        await this.base.swagLabsHomePage.clickLoginButton();
    }

    async ExpectLoginFailure(message: string){
        const error = await this.base.swagLabsHomePage.getErrorMessage();
        expect(error.trim()).toBe(message);
    }

    async CheckIfHomePageIsVisible(){
        return await this.base.swagLabsHomePage.checkForLoginLogo();
    }
}