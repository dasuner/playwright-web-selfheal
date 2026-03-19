import { test, expect } from '@playwright/test';
import { WelcomePage} from '../pages/welcome-page';
import { log } from '../utils/logger';


test.describe('login page test', () => {
    test.beforeEach('navigate to welcome screen',async({page})=>{
        await page.goto('/');
    });

    test('Login successfull', async ({ page }) => { 
        log.info('Test Started');
        const welcomePage = new WelcomePage(page);
        await welcomePage.performLogin(process.env.USER!,process.env.PASSWORD!)
        log.success('Login performed successfully');
        await page.waitForURL('**\/accounts');
        await expect(page).toHaveURL('https://uibank.uipath.com/accounts');
        log.pass('Login test passed - user navigated to accounts page');
    });

    test('Login fail', async ({ page }) => {
        log.info('Test Started');
        const welcomePage = new WelcomePage(page);
        await welcomePage.performLogin(process.env.USER!,'cdcdcdc')
        log.debug('Entered invalid credentials');
        await page.getByPlaceholder('Enter username').fill(process.env.USER!);
        await expect(page.getByText('login failed')).toBeVisible();
        log.pass('Login failure test passed - error message displayed as expected');
    });
});


