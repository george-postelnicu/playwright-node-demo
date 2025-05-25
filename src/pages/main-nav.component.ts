import {Locator, Page} from '@playwright/test';
import {ContactUsPage} from './contact-us.page';
import {SearchPage} from './search.page';

class MainNav {
    private readonly page: Page;
    private readonly navigationHeader: Locator;
    private readonly contactUs: Locator;
    public readonly searchSection: Locator;
    public readonly searchField: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navigationHeader = page.locator("//nav[contains(@id, 'navigationheader')]");
        this.searchSection = page.locator("//section[@role='search']");
        this.searchField = this.searchSection.locator("//input");
        this.contactUs = page.locator('//header').getByRole('link').filter({hasText: "Contact us"});
    }

    async navigate(mainCategory: string, secondCategory: string, openInNewTab: boolean): Promise<Page> {
        const mainNav = this.navigationHeader
            .getByRole("listitem")
            .filter({
                has: this.page
                    .locator("//a[contains(@class, 'cmp-navigation__item-link')]")
                    .filter({hasText: mainCategory})
            });

        await this.page
            .locator("//a[contains(@class, 'cmp-navigation__item-link')]")
            .filter({hasText: mainCategory})
            .hover();

        const secondNav = mainNav
            .locator("//a[contains(@class, 'cmp-navigation__flyout-group-item-link')]")
            .filter({hasText: secondCategory});

        if (openInNewTab) {
            const pagePromise = this.page.context().waitForEvent('page');
            await secondNav.click({modifiers: ['Control']});
            const newPage = await pagePromise;
            await newPage.bringToFront();
            return newPage;
        } else {
            await secondNav.click();
            return this.page;
        }
    }

    async openSearch(): Promise<void> {
        await this.searchSection.click();
    }

    async closeSearch(): Promise<void> {
        await this.searchSection.locator(".cmp-search__clear-icon").click();
    }

    async search(searchTerm: string): Promise<SearchPage> {
        await this.searchSection.click();
        await this.searchField.fill(searchTerm);
        await this.searchField.press("Enter");
        return new SearchPage(this.page);
    }

    async clickContactUs(): Promise<ContactUsPage> {
        await this.contactUs.click();
        return new ContactUsPage(this.page);
    }
}

export {MainNav};
