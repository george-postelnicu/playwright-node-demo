import type {Page} from "@playwright/test";

export class MainNav {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

}