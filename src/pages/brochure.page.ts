import {Locator, Page} from '@playwright/test';

class BrochurePage {
    private page: Page;
    public header: Locator;
    private downloadInfographic: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.getByRole('heading', {level: 1});
        this.downloadInfographic = page
            .locator("//iframe[@title='Embedded CTA']")
            .first()
            .frameLocator(':scope')
            .getByText("Download infographic");
    }

    async load(resource: string): Promise<void> {
        await this.page.goto(resource);
    }

    async download(): Promise<string> {
        // Start waiting for the download
        const downloadPromise = this.page.waitForEvent('download');

        // Perform the action that initiates download
        await this.downloadInfographic.click();

        const download = await downloadPromise;

        // Wait for the download process to complete and save the downloaded file
        const downloadPath = `./downloads/${download.suggestedFilename()}`;
        await download.saveAs(downloadPath);
        return downloadPath;
    }
}

export {BrochurePage};
