import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeadlessBrowserService } from './headless-browser/headless-browser.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, HeadlessBrowserService],
})
export class AppModule {}
