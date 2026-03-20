import { test, expect } from '@playwright/test';
import accountDetails from '../test-data/newAccounts.json';
import {AccountPage} from '../pages/account-page';
import {AccountApplyPage} from '../pages/account-accountApply-page';
import { WelcomePage} from '../pages/welcome-page';
import {AccountCreateResultsPage} from '../pages/account-accountCreateResults-page';

test.describe('new account', () => {
    test.beforeEach('login', async ({ page }) => {
        await page.goto('/');
        const welcomePage = new WelcomePage(page);
        await welcomePage.performLogin(process.env.USER!,process.env.PASSWORD!)
        await page.waitForURL('**/accounts');
        await expect(page).toHaveURL('https://uibank.uipath.com/accounts');
    });
    test('apply new account', async ({ page }) => {
        const accountPage = new AccountPage(page);
        await accountPage.clickApplyForNewAccountButton();
        const accountApplyPage = new AccountApplyPage(page);
        await accountApplyPage.applyForANewAccount(accountDetails.accountDetails.accountName,accountDetails.accountDetails.AcountType);
        const accountCreateResultsPage = new AccountCreateResultsPage(page);
        const congratsMsg = await accountCreateResultsPage.getCongratulationsMsg();
        console.log('Congratulations message visibility:', congratsMsg);
        expect(congratsMsg).toBeTruthy();
     });
});