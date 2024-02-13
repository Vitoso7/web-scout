import { Injectable } from '@nestjs/common';
import {
    type LaunchOptions,
    type BrowserContextOptions,
    type Page,
} from 'playwright';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { WebScoutMessage } from './types';

// TODO .env
const launchOptions: LaunchOptions = {
    headless: false,
} as const;

const browserContextOptions: BrowserContextOptions = {
    locale: '',
    acceptDownloads: false,
} as const;

type PageEvaluationResponse = {
    completeLinks: Array<string>;
    relativeLinks: Array<string>;
    anchorLinks: Array<string>;
    isPageRedirected: boolean;
    evaluatedTitle?: string;
    evaluatedUrl: string;
    startAt: Date;
    finishAt: Date;
};

type PageEvaluationArgs = {
    url: string;
    domain: string;
};

@Injectable()
export class HeadlessBrowserService {
    constructor() {}

    // TODO maybe use Crawlee in favor of simply using playwright since it provides more reliable browser fingerprints to avoid being blocked
    async scoutPage(webScoutMessage: WebScoutMessage): Promise<any> {
        chromium.use(StealthPlugin());

        // TODO Remove this
        console.log(webScoutMessage);

        // TODO Remove this and use webScoutMessage
        const url = 'https://www.crunchyroll.com/pt-br/series/G4PH0WXVJ';
        const domain = 'https://www.crunchyroll.com';

        const browserInstance = await chromium.launch(launchOptions);

        const browserContext = await browserInstance.newContext(
            browserContextOptions,
        );

        const page = await browserContext.newPage();

        // TODO Add logic to evaluate relative URLs
        const content = await this.#scoutPageEvaluation(page, url, domain);
    }

    async #scoutPageEvaluation(
        page: Page,
        url: string,
        domain: string,
    ): Promise<any> {
        await page.goto(url, { waitUntil: 'load' });

        // TODO Remove this
        console.log(`domain is ${domain}`);
        console.log(`url is ${url}`);
        console.log(`page.url() is ${page.url()}`);

        const evaluatedContent = await page.evaluate(
            (args: PageEvaluationArgs): PageEvaluationResponse => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false,
                });

                const evaluatedUrl = document.URL;

                // FIXME this logic is incorrect, also don't do this here inside the browser
                const isPageRedirected = evaluatedUrl !== args.url;

                console.log(`evaluated url: ${evaluatedUrl}`);

                const anchorTags = document.getElementsByTagName('a');

                // Sets to remove repeted links
                const completeLinks = new Set<string>();
                const relativeLinks = new Set<string>();
                const anchorLinks = new Set<string>();

                // TODO Filter email URIs and not web related stuff (Maybe not)
                // Ex.: mailto:pr@crunchyroll.com on hrefs
                for (let i = 0; i < anchorTags.length; i++) {
                    const hrefValue = anchorTags[i].getAttribute('href');

                    if (hrefValue === '' || hrefValue === '#') {
                        continue;
                    }

                    if (hrefValue.startsWith('/')) {
                        relativeLinks.add(`${args.domain}${hrefValue}`);
                        continue;
                    }

                    // FIXME this .includes is not working because the evaluatedUrl is wrong
                    if (
                        hrefValue.startsWith('#') ||
                        hrefValue.includes(`${evaluatedUrl}#`)
                    ) {
                        console.log(`HERE: ${evaluatedUrl}#`);
                        anchorLinks.add(hrefValue);
                        continue;
                    }

                    completeLinks.add(hrefValue);
                }

                // TODO Remove transformations (Sets -> Array) Sets might not be needed & put correct dates
                return {
                    anchorLinks: Array.from(anchorLinks),
                    completeLinks: Array.from(completeLinks),
                    finishAt: new Date(),
                    isPageRedirected,
                    relativeLinks: Array.from(relativeLinks),
                    startAt: new Date(),
                    evaluatedTitle: document.title,
                    evaluatedUrl,
                };
            },
            { url, domain },
        );

        console.log(evaluatedContent);
    }
}
