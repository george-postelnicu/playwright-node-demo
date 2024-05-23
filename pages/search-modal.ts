import {Locator, Page} from "@playwright/test";
import {SearchPage} from "./search-page";

export class SearchModal {
    readonly page: Page;
    private readonly _text: Locator;
    private readonly _search: Locator;
    private readonly _close: Locator;

    constructor(page: Page) {
        this.page = page;
        this._text = page.locator("//*[@id='search-modal']//input");
        this._close = page.locator("//*[@id='search-modal']//button[contains(@class, 'close')]");
        this._search = page.locator("//*[@id='search-modal']//button[contains(@class, 'btn btn-secondary')]");
    }

    async searchInModal(toSearch: string): Promise<SearchPage> {
        await this._text.fill(toSearch);
        await this._search.click();
        return new SearchPage(this.page);
    }

    async closeModal(): Promise<void> {
        await this._close.click();
        await this._close.waitFor({state: "hidden"});
    }

    async isModalHidden(): Promise<boolean> {
        return await (this._text.isHidden() && this._close.isHidden() && this._search.isHidden());
    }

    get text(): Locator {
        return this._text;
    }

    get search(): Locator {
        return this._search;
    }

    get close(): Locator {
        return this._close;
    }
}
