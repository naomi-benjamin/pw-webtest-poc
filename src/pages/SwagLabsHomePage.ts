import { BasePage } from '../bases/BasePage.js';
import type { Page } from '@playwright/test';

export class SwagLabsHomePage extends BasePage {
    private usernameField = this.page.locator('#user-name');
    private passwordField = this.page.locator('#password');
    private loginButton = this.page.locator('#login-button');
    private errorMessage = this.page.locator("div[class^='error-message-container']");
    private loginLogo = this.page.locator('.login_logo');

    constructor(page: Page) {
        super(page);
    }

    async setUsername(username: string) {
        await this.usernameField.fill(username);
    }

    async setPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }

    async isVisible(): Promise<boolean> {
        return this.loginLogo.isVisible();
    }
}
