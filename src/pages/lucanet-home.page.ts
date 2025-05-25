import type {Locator, Page} from "@playwright/test";
import {CookiesModal} from "./cookies.modal";
import {TopNav} from "./top.nav.component";
import {MainNav} from "./main-nav.component";

class LucanetHomePage {
    public readonly page: Page;
    public readonly cookiesModal: CookiesModal;
    public readonly topNav: TopNav;
    public readonly mainNav: MainNav;
    public readonly mainHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cookiesModal = new CookiesModal(this.page);
        this.mainHeader = page
            .locator(".hero-advanced__headline--default")
            .or(page.locator("//h1"));
        this.topNav = new TopNav(this.page);
        this.mainNav = new MainNav(this.page);
    }

    async goto() {
        await this.page.goto('/');
    }
}

export {LucanetHomePage};
