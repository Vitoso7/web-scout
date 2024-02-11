import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQConsumerService {
    // TODO .env
    private readonly QUEUE_NAME = 'urls_queue';
    private readonly RABBITMQ_URL = 'amqp://user:password@localhost:5672';

    async consume() {
        const connection = await amqp.connect(this.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(this.QUEUE_NAME, { durable: true });

        console.log(
            `[*] Waiting for messages in ${this.QUEUE_NAME}. To exit press CTRL+C`,
        );

        channel.consume(
            this.QUEUE_NAME,
            (msg) => {
                if (msg !== null) {
                    const content = msg.content.toString();
                    console.log(`Received message: ${content}`);
                    // TODO process message
                    channel.ack(msg);
                }
            },
            { noAck: false },
        );
    }
}
