import { test as base } from '@playwright/test';
import { SwagLabsHomePage } from '../pages/SwagLabsHomePage.js';
import { SwagLabsInventoryPage } from '../pages/SwagLabsInventoryPage.js';
import { LoginFacade } from '../facades/LoginFacade.js';
import { InventoryFacade } from '../facades/InventoryFacade.js';

export const AUTH_FILES = {
    standardUser: 'auth/standard-user.json',
    performanceGlitchUser: 'auth/performance-glitch-user.json',
} as const;

type AuthenticatedFixtures = {
    inventoryPage: SwagLabsInventoryPage;
    inventoryFacade: InventoryFacade;
};

type UnauthenticatedFixtures = {
    homePage: SwagLabsHomePage;
    loginFacade: LoginFacade;
};

// Factory that produces a named test object for a given user persona.
// Overrides `context` so all dependent fixtures (page, inventoryPage, etc.)
// automatically use the right auth state without any changes in test files.
function makeAuthenticatedTest(storageState: string) {
    return base.extend<AuthenticatedFixtures>({
        context: async ({ browser, contextOptions }, use) => {
            const ctx = await browser.newContext({ ...contextOptions, storageState });
            await use(ctx);
            await ctx.close();
        },
        inventoryPage: async ({ page }, use) => {
            await page.goto('/inventory.html');
            await use(new SwagLabsInventoryPage(page));
        },
        inventoryFacade: async ({ inventoryPage }, use) => {
            await use(new InventoryFacade(inventoryPage));
        },
    });
}

export const test = makeAuthenticatedTest(AUTH_FILES.standardUser);
export const performanceGlitchTest = makeAuthenticatedTest(AUTH_FILES.performanceGlitchUser);

// For tests that interact with the login page — no auth state loaded
export const unauthTest = base.extend<UnauthenticatedFixtures>({
    homePage: async ({ browser, contextOptions }, use) => {
        const { storageState: _omit, ...unauthContextOptions } = contextOptions;
        const ctx = await browser.newContext(unauthContextOptions);
        const page = await ctx.newPage();
        await page.goto('/');
        await use(new SwagLabsHomePage(page));
        await ctx.close();
    },
    loginFacade: async ({ homePage }, use) => {
        await use(new LoginFacade(homePage));
    },
});

export { expect } from '@playwright/test';
