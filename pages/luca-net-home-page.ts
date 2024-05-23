import type {Locator, Page} from "@playwright/test";
import {CookiesModal} from "./cookies-modal";
import {TopNav} from "./top-nav";
import {MainNav} from "./main-nav";
import {SearchPage} from "./search-page";
import {SearchModal} from "./search-modal";

export class LucaNetHomePage {
    readonly page: Page;
    private cookiesModal: CookiesModal;
    private topNav: TopNav;
    private mainNav: MainNav;

    constructor(page: Page) {
        this.page = page;
        this.cookiesModal = new CookiesModal(this.page);
        this.topNav = new TopNav(this.page);
        this.mainNav = new MainNav(this.page);
    }

    async goto() {
        await this.page.goto('/');
    }

    async acceptAllCookies() {
        await this.cookiesModal.acceptAllCookies();
    }

    async isTopNavVisible(): Promise<boolean> {
        return await this.topNav.isTopNavVisible();
    }

    get topNavSearch(): Locator {
        return this.topNav.search;
    }

    get topNavLanguage(): Locator {
        return this.topNav.language;
    }

    async search(toSearch: string): Promise<SearchPage> {
        return await this.topNav.find(toSearch);
    }

    async openSearch(): Promise<SearchModal> {
        return await this.topNav.openSearch();
    }
}