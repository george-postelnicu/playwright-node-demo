import type {Locator, Page} from "@playwright/test";

export class SearchPage {
    readonly page: Page;
    private readonly _searchFilter: Locator;
    private readonly _searchResults: Locator;

    constructor(page: Page) {
        this.page = page;
        this._searchFilter = this.page.locator("//div[contains(@class, 'tx-kesearch-pi1')]//*[@id='form_kesearch_pi1']");
        this._searchResults = this.page.locator("//div[@id='kesearch_results']");
    }

    async init(): Promise<void> {
        await this._searchFilter.waitFor({state: "visible"})
    }

    get searchFilter(): Locator {
        return this._searchFilter;
    }

    get searchResults(): Locator {
        return this._searchResults;
    }

    async getNumberOfResults(): Promise<string> {
        return await this.page.locator("//*[@id='kesearch_num_results']").textContent();
    }

    async getDisplayedResults(): Promise<number> {
        return await this.page.locator("//*[@id='kesearch_results']//a").count();
    }
}