import {test, expect} from '@playwright/test';
import {LucaNetHomePage} from "../pages/luca-net-home-page";
import {SearchPage} from "../pages/search-page";

let homePage: LucaNetHomePage;

test.beforeEach(async ({page}) => {
    homePage = new LucaNetHomePage(page);
    await homePage.goto();
    await homePage.acceptAllCookies();
});

test('should see navbar', async ({page}) => {
    await expect(homePage.topNavLanguage).toBeVisible();
    await expect(homePage.topNavSearch).toBeVisible();
});

test('should navigate to search page', async ({page}) => {
    const searchPage = await homePage.search("abc");

    await expect(searchPage.searchFilter).toBeVisible();
    await expect(searchPage.searchResults).toBeVisible();
});

test('should close search modal', async ({page}) => {
    const searchModal = await homePage.openSearch();
    await searchModal.closeModal();

    await expect(searchModal.close).toBeHidden();
    await expect(searchModal.search).toBeHidden();
    await expect(searchModal.text).toBeHidden();
});

test('should find search results', async ({page}) => {
    const searchPage = await homePage.search("IFRS");
    await searchPage.init();

    expect((await searchPage.getNumberOfResults()).trim()).toEqual("30 results");
    expect(await searchPage.getDisplayedResults()).toEqual(10);
});
