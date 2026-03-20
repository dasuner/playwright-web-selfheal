import { type Page } from "@playwright/test";
import { LocatorHealer } from "../utils/self-healer";

export class AccountApplyPage {
    readonly page: Page;
    private readonly healer: LocatorHealer;

    constructor(page: Page) {
        this.page = page;
        this.healer = new LocatorHealer(page);
    }

    async applyForANewAccount(accountName: string, accountType: string) {
        const accountNameLoc = await this.healer.heal('accountName', [
            () => this.page.getByRole('textbox', { name: 'Give a Nickname to Your' }),
            () => this.page.getByLabel('Account Name'),
            () => this.page.locator('#accountName'),
        ]);
        const accountTypeLoc = await this.healer.heal('accountType', [
            () => this.page.getByLabel('Type of Account'),
            () => this.page.locator('#accountType'),
        ]);
        const applyButtonLoc = await this.healer.heal('applyButton', [
            () => this.page.getByRole('button', { name: 'Apply' }),
            () => this.page.getByText('Apply'),
            () => this.page.locator('button[type="submit"]'),
        ]);
        await accountNameLoc.fill(accountName);
        await accountTypeLoc.selectOption(accountType);
        await applyButtonLoc.click();
        await this.page.waitForNavigation();
    }

}