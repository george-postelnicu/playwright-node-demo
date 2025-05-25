import {test as setup} from '@playwright/test';
import {LucanetHomePage} from "../src/pages/lucanet-home.page";
import {STORAGE} from "../playwright.config";

setup('accept cookies', async ({page}): Promise<void> => {
    const homePage = new LucanetHomePage(page);
    await homePage.goto();
    await homePage.cookiesModal.acceptAllCookies();

    await page.context().storageState({path: STORAGE});
});
