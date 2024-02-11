import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeadlessBrowserService } from './headless-browser/headless-browser.service';
import { RabbitMQConsumerService } from './consumer/client-queue-consumer.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, HeadlessBrowserService, RabbitMQConsumerService],
})
export class AppModule {}
