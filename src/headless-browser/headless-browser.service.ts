import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    InfiniteScrollOptions,
    PlaywrightCrawler,
    PlaywrightCrawlerOptions,
    PlaywrightLaunchContext,
} from 'crawlee';
import { WebScoutRequest } from './types';

// TODO implement .env

// TODO use on page.evaluate
// type PageEvaluationResponse = {
//     completeLinks: Array<string>;
//     relativeLinks: Array<string>;
//     anchorLinks: Array<string>;
//     isPageRedirected: boolean;
//     evaluatedTitle?: string;
//     evaluatedUrl: string;
//     startAt: Date;
//     finishAt: Date;
// };

// TODO use on page.evaluate
// type PageEvaluationArgs = {
//     url: string;
//     domain: string;
// };

const playwrightLaunchContext: PlaywrightLaunchContext = {
    useChrome: false,
};

const playwrightCrawlerOptions: PlaywrightCrawlerOptions = {
    headless: false,
    retryOnBlocked: true,
    launchContext: playwrightLaunchContext,
    keepAlive: true,
};

// TODO Create proper configuration
const infiniteScrollOptions: InfiniteScrollOptions = {
    scrollDownAndUp: true,
    maxScrollHeight: 0,
    waitForSecs: 2,
    stopScrollCallback() {
        console.log('scroll called');
    },
};

@Injectable()
export class HeadlessBrowserService implements OnModuleInit {
    private crawler: PlaywrightCrawler;

    // private currentRequest: any;

    async onModuleInit() {
        console.log('HeadlessBrowserService init');

        this.crawler = new PlaywrightCrawler({
            ...playwrightCrawlerOptions,
            async requestHandler({ page, log, infiniteScroll }) {
                log.info('requestHandler()');

                // await closeCookieModals();
                await infiniteScroll(infiniteScrollOptions);

                const content = await page.evaluate(() => {
                    console.log('hello from evaluation');

                    return 'nothing';
                });

                console.log(`url from evaluate: ${content}`);
            },
        });

        this.crawler.run();
    }

    async scoutPage(webScoutRequest: WebScoutRequest): Promise<any> {
        // TODO Check for running state and implement a fallback in case the value is false
        console.log('is headless browser running?', this.crawler.running);

        // TODO Add all webScoutMessage.urls to the queue

        await this.crawler.addRequests([
            {
                url: webScoutRequest.originalUrl,
                maxRetries: 0,
                keepUrlFragment: false,
            },
        ]);
    }
}
