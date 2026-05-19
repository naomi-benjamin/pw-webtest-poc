# Architecture & Design Decisions

This document explains the layered architecture used in this test suite, the reasoning behind each decision, and the rules that keep the layers clean as the suite grows.

---

## Layer Overview

```
tests/
  └── import from fixtures/test-fixtures.ts
        └── fixtures inject pages and facades
              ├── pages/     (one class per page, encapsulated selectors)
              └── facades/   (multi-step flows, navigation only)
                    └── pages/ (facades interact with page objects)
src/
  ├── bases/      BasePage — shared base for all page objects
  ├── fixtures/   test-fixtures.ts, Credentials, ErrorMessages, Product enum
  ├── pages/      SwagLabsHomePage, SwagLabsInventoryPage, ...
  ├── facades/    LoginFacade, InventoryFacade, ...
  └── setup/      global.setup.ts — authenticates each user persona
```

---

## Key Decisions

### 1. Playwright Fixtures Replace Manual Setup

**Before:** Every test file manually instantiated a `BaseTest` class and called `base.setup(page)` inside `beforeEach`. This was boilerplate-heavy and easy to forget or misconfigure.

**After:** A single extended `test` object (exported from `test-fixtures.ts`) injects page objects and facades directly into tests via Playwright's native fixture system. Setup, teardown, and dependency wiring are handled automatically.

```ts
// Before — manual, repetitive
test.beforeEach(async ({ page }) => {
    base = new BaseTest();
    await base.setup(page);
    loginFacade = new LoginFacade(base);
});

// After — declarative, automatic
test("example", async ({ inventoryFacade }) => { ... });
```

**Why:** Playwright fixtures provide isolation guarantees, correct teardown order, and dependency injection without any test-level plumbing.

---

### 2. Authentication via storageState, Not Per-Test Login

**Decision:** A `setup` project runs before the test suite and logs in once per user persona, saving the browser session (cookies and localStorage) to `auth/<persona>.json`. Authenticated test fixtures load the saved session instead of running through the login flow.

**Why:** Login is slow and adds flakiness. If login is broken, every test in the suite fails and the root cause is obscured. With `storageState`, login failures are isolated to the setup phase. Tests that specifically cover login behaviour use a separate `unauthTest` fixture that starts with a clean context.

**Multi-user pattern:** Adding a new user persona requires:
1. A `setup()` step in `global.setup.ts` saving to `auth/<role>.json`
2. One line in `test-fixtures.ts`: `export const roleTest = makeAuthenticatedTest(AUTH_FILES.role)`

No other files change.

---

### 3. Facades Are Navigation Only — No Assertions

**Rule:** Facades group multi-step user flows that span interactions across one or more pages. They return data or navigate. They never assert.

**Why:** Assertions belong in tests because tests are what express intent — what the system *should* do. When assertions live in facades, a failing test gives no information about what was expected vs. what happened, and the infrastructure layer becomes tightly coupled to specific outcomes.

```ts
// Wrong — assertion in facade
async expectLoginFailure(message: string) {
    const error = await this.homePage.getErrorMessage();
    expect(error.trim()).toBe(message); // ❌ not the facade's job
}

// Right — facade returns, test asserts
async getErrorMessage() {
    return this.homePage.getErrorMessage(); // ✅ just retrieves
}

// In the test:
expect((await homePage.getErrorMessage()).trim()).toBe(Errors.lockedOutError);
```

---

### 4. Page Objects Encapsulate Selectors and Stay Single-Page

**Rule:** A page object owns all selectors for its page. It exposes methods for interactions and queries. It has no knowledge of other pages or what comes next in a flow.

Product locators are accessed via a method that builds the selector from a `Product` enum value, rather than exposing raw `Locator` instances as public fields. This keeps selector strings inside the page object where they belong.

```ts
// Wrong — selector leaks out
public _addBackpackToCart = this.FindElement("#add-to-cart-sauce-labs-backpack"); // ❌ public, raw

// Right — page owns the selector, caller uses the enum
getAddToCartButton(product: Product) {
    return this.page.locator(`#add-to-cart-${product}`); // ✅ internal
}
```

**Why:** If a selector changes, only the page object changes. Tests and facades are unaffected.

---

### 5. BasePage Is Minimal

`BasePage` holds the `page` reference and nothing else. Earlier versions wrapped Playwright's `locator`, `fill`, and `click` in thin methods (`FindElement`, `Set`, `ClickOn`). These were removed because:

- Playwright's own API is already ergonomic and well-documented
- The wrappers added indirection without value
- They made page objects harder to read for anyone familiar with Playwright

Page objects now call `this.page.locator(...)`, `locator.fill(...)`, and `locator.click()` directly.

---

### 6. Test Data Lives in `src/fixtures/`

`Credentials.ts`, `ErrorMessages.ts`, and `Product.ts` (the product enum) all live in `src/fixtures/`. This keeps all test data in one predictable location. None of these files contain logic — they are pure constants.

---

## Rules to Maintain the Architecture

| Layer | Allowed to import | Never imports |
|---|---|---|
| `tests/` | `fixtures/`, `pages/` (inline only) | Direct Playwright locators |
| `facades/` | `pages/`, `fixtures/` | `tests/`, other facades |
| `pages/` | `bases/`, `fixtures/` | `facades/`, `tests/` |
| `bases/` | Playwright types only | Everything else |
| `fixtures/` | `pages/`, `facades/` | `tests/` |

**Facades never assert.** If you find yourself writing `expect` inside a facade, move it to the test.

**Page objects never navigate to another page.** If an action results in a page change, the facade or test handles what comes next.
