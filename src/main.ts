import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQConsumerService } from './consumer/client-queue-consumer.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const service = app.get(RabbitMQConsumerService);
    await service.consume();

    await app.listen(3000);
}
bootstrap();
