import {Locator, Page} from '@playwright/test';
import {ContactUsForm} from "../models/contact-us-form";

enum FieldsetEnum {
    FIRSTNAME = "hs-firstname",
    LASTNAME = "hs-lastname",
    COMPANY = "hs-company",
    EMAIL = "hs-email",
    JOB_TITLE = "hs-jobtitle",
    PHONE = "hs-phone",
    COUNTRY = "hs-country",
    CONTACT_TOPIC = "hs-contact_topic",
    MESSAGE = "hs-situation__c"
}

class ContactUsPage {
    private page: Page;
    public header: Locator;
    public formErrors: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.getByRole('heading', {level: 1});
        this.formErrors = page.locator("//div[contains(@class, 'hs_error_rollup')]//label");
    }

    async fillForm(form: ContactUsForm): Promise<void> {
        if (form.firstname) {
            await this.page.locator("//input[@name='firstname']").fill(form.firstname);
        }
        if (form.lastname) {
            await this.page.locator("//input[@name='lastname']").fill(form.lastname);
        }
        if (form.company) {
            await this.page.locator("//input[@name='company']").fill(form.company);
        }
        if (form.email) {
            await this.page.locator("//input[@name='email']").fill(form.email);
        }
        if (form.jobTitle) {
            await this.page.locator("//input[@name='jobtitle']").fill(form.jobTitle);
        }
        if (form.phone) {
            await this.page.locator("//input[@name='phone']").fill(form.phone);
        }
        if (form.country) {
            await this.page.locator("//select[@name='country']").selectOption({label: form.country});
        }
        if (form.contactTopic) {
            await this.page.locator("//select[@name='contact_topic']").selectOption({label: form.contactTopic});
        }
        if (form.message) {
            await this.page.locator("//textarea[@name='situation__c']").fill(form.message);
        }
    }

    getFormFieldErrorLabel(field: FieldsetEnum): Locator {
        return this.page
            .locator(`//form//fieldset/div[contains(@class, '${field}')]`)
            .locator("//label[contains(@class, 'hs-error-msg')]");
    }

    static getValueOfForm(field: FieldsetEnum, form: ContactUsForm): string | undefined {
        switch (field) {
            case FieldsetEnum.FIRSTNAME:
                return form.firstname;
            case FieldsetEnum.LASTNAME:
                return form.lastname;
            case FieldsetEnum.COMPANY:
                return form.company;
            case FieldsetEnum.EMAIL:
                return form.email;
            case FieldsetEnum.JOB_TITLE:
                return form.jobTitle;
            case FieldsetEnum.PHONE:
                return form.phone;
            case FieldsetEnum.COUNTRY:
                return form.country;
            case FieldsetEnum.CONTACT_TOPIC:
                return form.contactTopic;
            case FieldsetEnum.MESSAGE:
                return form.message;
            default:
                return undefined;
        }
    }

    async submit(): Promise<void> {
        await this.page.locator("//input[@value='Send Request']").click();
    }
}

export {ContactUsPage, FieldsetEnum};
