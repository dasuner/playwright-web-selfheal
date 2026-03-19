import { type Page } from '@playwright/test';
import { LocatorHealer } from '../utils/self-healer';

export class AccountPage {
    readonly page: Page;
    private readonly healer: LocatorHealer;

    constructor(page: Page) {
        this.page = page;
        this.healer = new LocatorHealer(page);
    }

    async clickApplyForNewAccountButton() {
        const btn = await this.healer.heal('applyForNewAccount', [
            () => this.page.getByText('Apply For New Account'),
            () => this.page.getByRole('button', { name: /apply/i }),
            () => this.page.locator('#apply-new-account'),
        ]);
        await btn.click();
    }

}