import { type Locator, type Page } from '@playwright/test';
import { LocatorHealer } from '../utils/self-healer';

export class WelcomePage {
    readonly page: Page;
    private healer: LocatorHealer;

    constructor(page: Page) {
        this.page = page;
        this.healer = new LocatorHealer(page);
    }

    async performLogin(username: string, password: string) {
        const userLoc = await this.healer.heal('username', [
            () => this.page.getByPlaceholder('Enter username'),
            () => this.page.getByLabel('Username'),
            () => this.page.locator('#username'),
            () => this.page.getByRole('textbox', { name: /user/i }),
        ]);

        const passLoc = await this.healer.heal('password', [
            () => this.page.getByPlaceholder('Enter password'),
            () => this.page.getByLabel('Password'),
            () => this.page.locator('#password'),
            () => this.page.getByRole('textbox', { name: /pass/i }),
        ]);

        const signInLoc = await this.healer.heal('signIn', [
            () => this.page.getByRole('button', { name: 'Sign In' }),
            () => this.page.getByText('Sign In'),
            () => this.page.locator('button[type="submit"]'),
        ]);

        const policyLoc = await this.healer.heal('policy', [
            () => this.page.getByRole('button', { name: 'I agree to the Privacy Policy ' }),
             () => this.page.locator('button#privacy-accept'),
        ]);

        await userLoc.fill(username);
        await passLoc.fill(password);
        await signInLoc.click();
        //await policyLoc.click();
        // policy may or may not be present depending on flow
        try {
            if ((await policyLoc.count()) > 0) await policyLoc.click();
        } catch {
            // ignore
        }
    }
}