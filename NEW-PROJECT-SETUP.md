# Playwright Test Suite — New Project Setup Briefing

Paste this document into a new conversation along with: the SUT base URL, user credentials for each persona, and a list of pages/flows to cover first. Then say: "Set up this Playwright project using the architecture below."

---

## What You Are Setting Up

A TypeScript Playwright test suite using a layered architecture designed for a medium-sized app (15–50 pages), small team (2–5 people). Priorities in order: scalability, maintainability, readability.

---

## Folder Structure to Create

```
src/
  bases/          BasePage.ts
  facades/        one file per feature area (e.g. LoginFacade.ts)
  fixtures/       Credentials.ts, ErrorMessages.ts, <Domain>Enums.ts, test-fixtures.ts
  pages/          one file per page (e.g. LoginPage.ts)
  setup/          global.setup.ts
tests/            one file per feature area (e.g. Login.Test.ts)
auth/             (gitignored — generated at runtime)
```

---

## Rules — Do Not Deviate From These

- **Facades never assert.** They navigate and return data. `expect()` belongs in the test file only.
- **Page objects never navigate to another page.** If an action causes a page transition, the facade or test handles what comes next.
- **Page objects never expose raw `Locator` fields publicly.** All selectors stay private. Use typed enum values or string parameters in public methods.
- **`BasePage` stays minimal** — it holds `this.page: Page` and nothing else. No wrapper methods around Playwright's API.
- **Tests own all assertions.** Facades and page objects return data for the test to assert on.
- **Do not create a `BaseTest` class.** Playwright fixtures replace it entirely.

---

## Layer Implementations

### BasePage

```ts
import type { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
}
```

### Page Objects

One class per page, extending `BasePage`. All locators are private. Public methods expose interactions and queries only.

```ts
import { BasePage } from '../bases/BasePage.js';
import type { Page } from '@playwright/test';

export class LoginPage extends BasePage {
    private usernameField = this.page.locator('#username');
    private passwordField = this.page.locator('#password');
    private loginButton = this.page.locator('#login-button');
    private errorMessage = this.page.locator('.error-message');

    constructor(page: Page) { super(page); }

    async setUsername(username: string) { await this.usernameField.fill(username); }
    async setPassword(password: string) { await this.passwordField.fill(password); }
    async clickLoginButton() { await this.loginButton.click(); }
    async getErrorMessage(): Promise<string> { return await this.errorMessage.textContent() ?? ''; }
    async isVisible(): Promise<boolean> { return this.page.locator('.login-logo').isVisible(); }
}
```

For pages with a list of typed items (e.g. products, records), expose an access method using an enum, not public locator fields:

```ts
// In src/fixtures/<Domain>Enums.ts
export enum Product {
    ItemOne = 'item-one-slug',
    ItemTwo = 'item-two-slug',
}

// In the page object
getAddToCartButton(product: Product) {
    return this.page.locator(`#add-to-cart-${product}`);
}
async addItemToCart(product: Product) {
    await this.getAddToCartButton(product).click();
}
```

### Facades

One file per feature area. Takes page objects as constructor arguments. Navigation and actions only.

```ts
import { LoginPage } from '../pages/LoginPage.js';
import { TestUsers } from '../fixtures/Credentials.js';

export class LoginFacade {
    constructor(private loginPage: LoginPage) {}

    async login(username: string, password: string) {
        await this.loginPage.setUsername(username);
        await this.loginPage.setPassword(password);
        await this.loginPage.clickLoginButton();
    }

    async loginAsStandardUser() {
        const user = TestUsers.standardUser;
        await this.login(user.username, user.password);
    }
}
```

### Global Setup

Uses Playwright's **project dependency pattern** (not `globalSetup` in the config). One `setup()` call per user persona. Each saves to its own auth file.

```ts
// src/setup/global.setup.ts
import { test as setup } from '@playwright/test';
import { TestUsers } from '../fixtures/Credentials.js';

async function loginAs(page: import('@playwright/test').Page, username: string, password: string) {
    await page.goto('/');
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('#login-button');
    await page.waitForURL('**/dashboard'); // update to the post-login URL pattern
}

setup('authenticate as standard user', async ({ page }) => {
    await loginAs(page, TestUsers.standardUser.username, TestUsers.standardUser.password);
    await page.context().storageState({ path: 'auth/standard-user.json' });
});

// Add one setup() block per persona:
setup('authenticate as admin user', async ({ page }) => {
    await loginAs(page, TestUsers.adminUser.username, TestUsers.adminUser.password);
    await page.context().storageState({ path: 'auth/admin-user.json' });
});
```

### Test Fixtures

The factory function `makeAuthenticatedTest` overrides the built-in `context` fixture, spreading `contextOptions` so that `baseURL`, `viewport`, and all project settings are preserved — only `storageState` is swapped. Because `page` depends on `context`, all downstream fixtures automatically use the right session.

`unauthTest` strips `storageState` out of `contextOptions` by destructuring before spreading, to satisfy `exactOptionalPropertyTypes`.

Add one export per user persona.

```ts
// src/fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { LoginFacade } from '../facades/LoginFacade.js';
// import other pages and facades as needed

export const AUTH_FILES = {
    standardUser: 'auth/standard-user.json',
    adminUser: 'auth/admin-user.json',
    // add one entry per persona
} as const;

type AuthenticatedFixtures = {
    // add a fixture for each page and facade needed by authenticated tests
    loginFacade: LoginFacade;
};

type UnauthenticatedFixtures = {
    loginPage: LoginPage;
    loginFacade: LoginFacade;
};

function makeAuthenticatedTest(storageState: string) {
    return base.extend<AuthenticatedFixtures>({
        context: async ({ browser, contextOptions }, use) => {
            const ctx = await browser.newContext({ ...contextOptions, storageState });
            await use(ctx);
            await ctx.close();
        },
        // add page and facade fixtures here, e.g.:
        loginFacade: async ({ page }, use) => {
            await use(new LoginFacade(new LoginPage(page)));
        },
    });
}

export const test = makeAuthenticatedTest(AUTH_FILES.standardUser);
export const adminTest = makeAuthenticatedTest(AUTH_FILES.adminUser);

// For tests that interact with the login page — no auth state loaded
export const unauthTest = base.extend<UnauthenticatedFixtures>({
    loginPage: async ({ browser, contextOptions }, use) => {
        const { storageState: _omit, ...unauthContextOptions } = contextOptions;
        const ctx = await browser.newContext(unauthContextOptions);
        const page = await ctx.newPage();
        await page.goto('/');
        await use(new LoginPage(page));
        await ctx.close();
    },
    loginFacade: async ({ loginPage }, use) => {
        await use(new LoginFacade(loginPage));
    },
});

export { expect } from '@playwright/test';
```

### Playwright Config

- Set `baseURL` to the SUT base URL.
- The `setup` project points to `src/setup/` and has no `storageState` (it creates the auth files).
- All other projects list `'setup'` as a dependency. They do NOT set `storageState` — fixtures handle that.
- Use `...(process.env.CI ? { workers: 1 } : {})` spread pattern for workers (required when `exactOptionalPropertyTypes: true`).

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    outputDir: './reports/run-info',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    ...(process.env.CI ? { workers: 1 } : {}),
    reporter: [['html', { outputFolder: 'reports/results' }]],
    use: {
        baseURL: 'https://your-sut-url.com', // <-- fill in
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        headless: false,
    },
    projects: [
        {
            name: 'setup',
            testDir: './src/setup',
            testMatch: /global\.setup\.ts/,
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup'],
        },
    ],
});
```

### tsconfig

Enable `exactOptionalPropertyTypes` and `strict`. Add `"node"` to the `types` array (requires `@types/node` installed).

```json
{
    "compilerOptions": {
        "module": "nodenext",
        "target": "esnext",
        "types": ["node"],
        "strict": true,
        "exactOptionalPropertyTypes": true,
        "verbatimModuleSyntax": true,
        "isolatedModules": true,
        "moduleDetection": "force",
        "skipLibCheck": true,
        "sourceMap": true
    }
}
```

### .gitignore

```
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
auth/
```

---

## Test File Shape

Authenticated tests import `test` (or a named persona variant) and `expect` from `test-fixtures.ts`. Unauthenticated tests import `unauthTest`. All `expect()` calls live in the test file.

```ts
// tests/Login.Test.ts
import { unauthTest, expect } from '../src/fixtures/test-fixtures.js';
import { SwagLabsHomePageErrorMessages as Errors } from '../src/fixtures/ErrorMessages.js';

unauthTest.describe("Login Tests", () => {
    unauthTest("blank credentials shows error", async ({ loginPage }) => {
        await loginPage.clickLoginButton();
        expect((await loginPage.getErrorMessage()).trim()).toBe(Errors.blankUsername);
    });
});
```

```ts
// tests/SomeFeature.Test.ts
import { test, adminTest, expect } from '../src/fixtures/test-fixtures.js';

test.describe("Feature Tests — Standard User", () => {
    test("does the thing", async ({ featureFacade }) => {
        const result = await featureFacade.doTheThing();
        expect(result).toBe(true);
    });
});

adminTest.describe("Feature Tests — Admin User", () => {
    adminTest("sees admin-only thing", async ({ featureFacade }) => {
        const result = await featureFacade.getAdminOnlyData();
        expect(result).toBeDefined();
    });
});
```

---

## What to Provide When Starting a New Project

Fill these in before handing off to Claude:

- **SUT base URL** — e.g. `https://app.yourcompany.com`
- **Post-login URL pattern** — what `waitForURL` should match after a successful login
- **User personas** — username, password, and role name for each
- **Pages to implement first** — name, URL path, and key elements/interactions for each
- **Enums needed** — any typed item lists (e.g. product names, record types, menu items)
- **First test scenarios** — what flows to cover in the first test files
