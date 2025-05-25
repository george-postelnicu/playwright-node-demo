import {expect, test as base,} from '@playwright/test';
import {fakerDE as faker} from '@faker-js/faker'
import {ContactUsForm} from '../src/models/contact-us-form';
import {BrochurePage} from '../src/pages/brochure.page';
import {ContactUsPage, FieldsetEnum} from '../src/pages/contact-us.page';
import {LucanetHomePage} from '../src/pages/lucanet-home.page';
import {Language} from "../src/pages/top.nav.component";
import {sha256sum} from "../src/utils/file.util";
import {createI18nFixture} from "playwright-i18next-fixture";
import i18nDe from '../src/localizations/de/i18n.json';
import i18nEn from '../src/localizations/en/i18n.json';
import i18nEs from '../src/localizations/es/i18n.json';
import i18nFr from '../src/localizations/fr/i18n.json';
import i18nIt from '../src/localizations/it/i18n.json';
import i18nNl from '../src/localizations/nl/i18n.json';

const i18nFixture = createI18nFixture({
    options: {
        debug: false,
        ns: ['translations'],
        supportedLngs: ['de', 'en', 'es', 'fr', 'it', 'nl'],
        cleanCode: true,
        resources: {
            de: {
                translations: i18nDe,
            },
            en: {
                translations: i18nEn,
            },
            es: {
                translations: i18nEs,
            },
            fr: {
                translations: i18nFr,
            },
            it: {
                translations: i18nIt,
            },
            nl: {
                translations: i18nNl,
            },
        }
    },
    cache: true,
    auto: true
});
export const test = base.extend(i18nFixture).extend<{
    homePage: LucanetHomePage;
    // i18nFix: i18n;
}>({
    homePage: async ({page}, use) => {
        const homePage = new LucanetHomePage(page);
        await homePage.goto();
        await use(homePage);
    },
    /*    i18nFix: async ({i18n}, use) => {
            await i18n.changeLanguage('en');
            await use(i18n);
        },*/
});

test('has title', async ({homePage}) => {
    await expect(homePage.page).toHaveTitle("The CFO Solution Platform. Cloud-first. AI-elevated :: Lucanet");
    await expect(homePage.mainHeader).toHaveText("The CFO Solution Platform for future-ready finance leaders");
});

test.describe('language tests', () => {
    for (const language of Object.keys(Language)) {
        test(`can change language to ${language}`, async ({homePage, i18n: i18n}) => {
            await i18n.changeLanguage(language);

            if (language.toLowerCase() !== 'en') {
                await homePage.topNav.selectLanguage(Language[language]);
            }

            await expect(homePage.page).toHaveTitle(i18n.t('home_page.title'));
            await expect(homePage.mainHeader).toHaveText(i18n.t('home_page.header'));
        });
    }
});

test('can close search modal', async ({homePage}) => {
    const mainNav = homePage.mainNav;
    await mainNav.openSearch();
    await expect(mainNav.searchField).toBeVisible();
    await mainNav.closeSearch();
    await expect(mainNav.searchField).toBeHidden();
});

test('wrong search returns no results', async ({homePage}) => {
    const mainNav = homePage.mainNav;
    const searchPage = await mainNav.search("abcd");
    await expect(searchPage.resultHits).toHaveText("Showing 0 search results");
    await expect(searchPage.noResultBigMessage).toHaveText("Sorry, no results matched your search terms.");
    await expect(searchPage.resultLinks).toHaveCount(0);
});

test('IFRS search returns results', async ({homePage}) => {
    const mainNav = homePage.mainNav;
    const searchPage = await mainNav.search("IFRS");
    await expect(searchPage.resultHits).toHaveText(/Showing \d{2,3} search results/);
    await expect(searchPage.noResultBigMessage).toBeHidden();
});

test('multi window contact page', async ({homePage}) => {
    const mainNav = homePage.mainNav;
    const navigationLinks = [
        {main: "Solutions", secondary: "Solutions", header: "Integrated solutions for all CFO jobs-to-be-done"},
        {main: "Platform", secondary: "Innovation Hub", header: "Innovation Hub"},
        {main: "Customers", secondary: "Our partners", header: "Meet our trusted partners"},
        {main: "Resources", secondary: "Blog", header: "Insights"},
        {main: "Why Lucanet", secondary: "About Us", header: "We're Lucanet"}
    ];

    for (const navigation of navigationLinks) {
        const newPage = await mainNav.navigate(navigation.main, navigation.secondary, true);
        await expect(newPage.getByRole('heading', {level: 1})).toHaveText(navigation.header);
        await newPage.close();
    }
});

test('contact us form with missing phone', async ({homePage}) => {
    const contactPage = await homePage.mainNav.clickContactUs();
    const form = getContactForm();
    await contactPage.fillForm(form);
    await contactPage.submit();

    await expect(contactPage.formErrors).toHaveText("Please complete all required fields.");

    for (const field of Object.values(FieldsetEnum)) {
        const label = contactPage.getFormFieldErrorLabel(field);
        const valueToCheck = ContactUsPage.getValueOfForm(field, form);

        if (typeof valueToCheck === 'string') {
            await expect(label).toBeHidden();
        } else {
            await expect(label).toHaveText("Please complete this required field.");
        }
    }
});

test('download brochure file', async ({page}) => {
    const brochurePage = new BrochurePage(page);
    await brochurePage.load('/en/resource-hub/infographics/find-the-right-consolidation-software/');
    await expect(brochurePage.header).toHaveText('How Do I find the right financial consolidation software?');

    const filePath: string = await brochurePage.download();
    const fileHash: string = await sha256sum(filePath);

    expect(fileHash).toBe('6d35cedf7d1cbcf75a3b94f204fa5af987355b9da54bd821d85f096d55ce1b54');
});

function getContactForm(): ContactUsForm {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@abc.com`;

    return {
        firstname: firstName,
        lastname: lastName,
        company: faker.company.name(),
        email: email,
        jobTitle: faker.person.jobTitle(),
        phone: null,
        country: 'Romania',
        contactTopic: "Appointment request",
        message: faker.lorem.text().substring(0, 100)
    };
}