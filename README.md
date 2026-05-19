# pw-webtest-poc

A Playwright end-to-end test suite for [SauceDemo](https://www.saucedemo.com), used as a proof of concept for the refined test architecture used in production.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)

## Setup

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd pw-webtest-poc
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

**Run the full suite (all browsers):**
```bash
npx playwright test
```

**Run on a single browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Run a specific test file:**
```bash
npx playwright test tests/Inventory.Test.ts
```

**Run in headed mode (watch the browser):**
```bash
npx playwright test --headed
```

**View the HTML report after a run:**
```bash
npx playwright show-report reports/results
```

## How Authentication Works

Before any tests run, a `setup` project logs in for each user persona and saves the browser session to `auth/`. Authenticated test fixtures load the appropriate session file, so tests never repeat the login flow.

The `auth/` directory is gitignored — it is generated fresh on each machine when the suite runs.

## Project Structure

```
src/
  bases/        # BasePage: thin base class all page objects extend
  facades/      # Multi-step navigation flows (no assertions)
  fixtures/     # Test data: credentials, error messages, product enum, test fixtures
  pages/        # Page objects: one class per page, encapsulated selectors
  setup/        # Global setup: authenticates each user persona and saves session state
tests/          # Test files
auth/           # Generated session files (gitignored)
reports/        # Test results and HTML report output
```

## Adding a New User Persona

1. Add the user credentials to `src/fixtures/Credentials.ts`
2. Add a `setup()` step in `src/setup/global.setup.ts` that logs in and saves to `auth/<role>.json`
3. Export a named test fixture from `src/fixtures/test-fixtures.ts` using `makeAuthenticatedTest(AUTH_FILES.<role>)`
4. Import and use the new fixture in any test file that needs that persona
