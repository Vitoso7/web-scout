import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HeadlessBrowserService } from './headless-browser/headless-browser.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly headlessBrowserService: HeadlessBrowserService,
    ) {}

    @Get()
    getHello(): string {
        return this.headlessBrowserService.scoutWebPage();
    }
}
