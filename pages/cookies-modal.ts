import type {Page} from "@playwright/test";

export class CookiesModal {
    readonly page: Page;
    public FIND_BY_DIV_ID = "//*[@id='%s']";

    constructor(page: Page) {
        this.page = page;
    }

    async acceptAllCookies() {
        await this.waitAndAcceptModal("CybotCookiebotDialog", "CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll");
    }

    async waitAndAcceptModal(idModal: string, idButton: string) {
        await this.page.locator(this.FIND_BY_DIV_ID.replace("%s", idModal)).waitFor({state: "visible"});
        await this.page.locator(this.FIND_BY_DIV_ID.replace("%s", idButton)).click();
        await this.page.locator(this.FIND_BY_DIV_ID.replace("%s", idModal)).waitFor({state: "hidden"});
    }
}
