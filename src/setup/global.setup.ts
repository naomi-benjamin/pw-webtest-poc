import { test as setup } from '@playwright/test';
import { TestUsers } from '../fixtures/Credentials.js';

const AUTH_FILES = {
    standardUser: 'auth/standard-user.json',
    performanceGlitchUser: 'auth/performance-glitch-user.json',
} as const;

async function loginAs(page: import('@playwright/test').Page, username: string, password: string) {
    await page.goto('/');
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
    await page.waitForURL('**/inventory.html');
}

setup('authenticate as standard user', async ({ page }) => {
    await loginAs(page, TestUsers.standardUser.username, TestUsers.standardUser.password);
    await page.context().storageState({ path: AUTH_FILES.standardUser });
});

setup('authenticate as performance glitch user', async ({ page }) => {
    await loginAs(page, TestUsers.performanceGlitchUser.username, TestUsers.performanceGlitchUser.password);
    await page.context().storageState({ path: AUTH_FILES.performanceGlitchUser });
});
