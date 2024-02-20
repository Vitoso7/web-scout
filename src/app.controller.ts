import { Controller, Post, Body } from '@nestjs/common';
// import { AppService } from './app.service';
import { HeadlessBrowserService } from './headless-browser/headless-browser.service';
import { WebScoutRequest } from './headless-browser/types';

@Controller()
export class AppController {
    constructor(
        // private readonly appService: AppService,
        private readonly headlessBrowserService: HeadlessBrowserService,
    ) {}

    @Post()
    getHello(@Body() webScoutRequest: WebScoutRequest): any {
        return this.headlessBrowserService.scoutPage(webScoutRequest);
    }
}
