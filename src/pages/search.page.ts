import { Page, Locator } from '@playwright/test';

class SearchPage {
    public resultHits: Locator;
    public noResultBigMessage: Locator;
    public results: Locator;
    public resultLinks: Locator;

    constructor(page: Page) {
        this.resultHits = page.locator(".cmp-results-count");
        this.noResultBigMessage = page.locator(".no-results__title");
        this.results = page.locator("section.cmp-searchresults__items__values");
        this.resultLinks = this.results.locator("//article");
    }
}

export {SearchPage};
