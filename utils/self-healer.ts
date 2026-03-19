import { type Locator, type Page } from '@playwright/test';
import logger from './logger';

/**
 * Simple locator healer: try candidate locator factories in order, cache the first that exists.
 * Logs healing events via `utils/logger.ts`.
 */
export class LocatorHealer {
    private page: Page;
    private cache = new Map<string, Locator>();

    constructor(page: Page) {
        this.page = page;
    }

    private async exists(locator: Locator): Promise<boolean> {
        try {
            return (await locator.count()) > 0;
        } catch {
            return false;
        }
    }

    /**
     * Try candidate factories and return the first Locator that exists on the page.
     * The result is cached by `name` for subsequent calls.
     */
    async heal(name: string, candidates: Array<() => Locator>): Promise<Locator> {
        if (this.cache.has(name)) return this.cache.get(name)!;

        for (const factory of candidates) {
            const loc = factory();
            if (await this.exists(loc)) {
                logger.info(`LocatorHealer: healed '${name}' with candidate`);
                this.cache.set(name, loc);
                return loc;
            }
        }

        // Fallback: use first candidate and cache it (may throw later if not present)
        const fallback = candidates[0]();
        logger.warn(`LocatorHealer: fallback for '${name}' to primary candidate`);
        this.cache.set(name, fallback);
        return fallback;
    }
}
