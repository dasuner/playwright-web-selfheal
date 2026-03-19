import {type Page} from '@playwright/test';
import { LocatorHealer } from '../utils/self-healer';
import { log } from '../utils/logger';

export class AccountCreateResultsPage {
    readonly page: Page;
    private readonly healer: LocatorHealer;

    constructor(page: Page) {
        this.page = page;
        this.healer = new LocatorHealer(page);
    }

    async getCongratulationsMsg() {
        try {
            const congratulationsLoc = await this.healer.heal('congratulationsmsg', [
                () => this.page.getByRole('heading', { name: ' Congratulations! ' }),
                () => this.page.getByText('Congratulations! Your account has been created.'),
                () => this.page.locator('.congratulations-message'),
            ]);
            log.success('Congratulations message is visible');
            console.log('Congratulations message visibility:', await congratulationsLoc.isVisible());
            return await congratulationsLoc.isVisible();
        } catch (error) {
            log.error(`Failed to check congratulations message visibility: ${error}`);
            return false;
        }
    }
}