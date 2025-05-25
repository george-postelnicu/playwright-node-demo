import type {Locator, Page} from "@playwright/test";

export class CookiesModal {
    private modal: Locator;
    private acceptButton: Locator;

    constructor(page: Page) {
        this.modal = page.locator("#CybotCookiebotDialog");
        this.acceptButton = page.locator("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll");
    }

    async acceptAllCookies(): Promise<void> {
        await this.modal.waitFor({state: "visible"});
        await this.acceptButton.click();
        await this.modal.waitFor({state: "hidden"});
    }
}
