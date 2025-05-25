import {expect, Locator, Page} from '@playwright/test';

enum Language {
    EN = "English",
    DE = "Deutsch",
    ES = "Español",
    FR = "Français",
    IT = "Italiano",
    NL = "Nederlands"
}

class TopNav {
    private page: Page;
    private topNav: Locator;
    private language: Locator;
    private languageDropdown: Locator;
    public search: Locator;

    constructor(page: Page) {
        this.page = page;
        this.topNav = page.locator(".utilitybar");
        this.language = this.topNav.locator(".languagenavigation");
        this.languageDropdown = this.language.locator("ul");
        this.search = this.topNav.locator("section.cmp-search");
    }

    async selectLanguage(language: Language): Promise<void> {
        await this.language.click();
        await expect(this.language).toHaveClass('languagenavigation --open');
        const link = this.languageDropdown.getByRole('link', {name: language});
        await link.click();
    }
}

export {TopNav, Language};
