import { Injectable } from '@nestjs/common';
import { type LaunchOptions } from 'playwright';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// TODO .env
const launchOptions: LaunchOptions = {
    headless: false,
} as const;

@Injectable()
export class HeadlessBrowserService {
    constructor() {}

    scoutWebPage(): any {
        chromium.use(StealthPlugin());

        const url = 'https://www.crunchyroll.com/pt-br/series/G4PH0WXVJ';

        chromium.launch(launchOptions).then(async (browser) => {
            const page = await browser.newPage();

            await page.goto(url);
        });
    }
}
