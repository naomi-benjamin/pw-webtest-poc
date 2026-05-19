import { SwagLabsHomePage } from '../pages/SwagLabsHomePage.js';
import { TestUsers } from '../fixtures/Credentials.js';

export class LoginFacade {
    constructor(private homePage: SwagLabsHomePage) {}

    async login(username: string, password: string) {
        await this.homePage.setUsername(username);
        await this.homePage.setPassword(password);
        await this.homePage.clickLoginButton();
    }

    async loginAsStandardUser() {
        const user = TestUsers.standardUser;
        await this.login(user.username, user.password);
    }
}
