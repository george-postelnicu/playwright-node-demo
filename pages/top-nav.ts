import type {Locator, Page} from "@playwright/test";
import {SearchModal} from "./search-modal";

export class TopNav {
    readonly page: Page;
    private readonly _language: Locator;
    private readonly _search: Locator;

    constructor(page: Page) {
        this.page = page;
        this._language = page.locator("//div[@class='lnet-top-menu']//button[contains(@class, 'language-switcher-button')]");
        this._search = page.locator("//div[@class='lnet-top-menu']//button[contains(@class, 'btn btn--search')]");
    }

    async isTopNavVisible() {
        return await (this._search.isVisible() && this._language.isVisible());
    }

    get language(): Locator {
        return this._language;
    }

    get search(): Locator {
        return this._search;
    }

    async find(toSearch: string) {
        await this._search.click();
        const searchModal = new SearchModal(this.page);
        return await searchModal.searchInModal(toSearch);
    }

    async openSearch() {
        await this._search.click();
        return new SearchModal(this.page);
    }
}