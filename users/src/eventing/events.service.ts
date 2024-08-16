import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { ILoggerService, LOGGER_SERVICE } from 'src/lib/logger';
import { eventingContext } from './context';
import { IEventsService } from './events.service.interface';

@Injectable()
export class EventsService implements OnModuleInit, IEventsService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  constructor(
    private readonly configService: ConfigService,
    @Inject(LOGGER_SERVICE) private readonly logger: ILoggerService,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async send(exchange: string, routingKey: string, data: any): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(data)),
    );
  }

  private async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect({
        username: this.configService.get<string>('RABBIT_USERNAME'),
        password: this.configService.get<string>('RABBIT_PASSWORD'),
        hostname: this.configService.get<string>('RABBIT_HOST'),
        port: this.configService.get<number>('RABBIT_PORT'),
        protocol: this.configService.get<string>('RABBIT_PROTOCOL'),
      });
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(
        eventingContext.exchange.name,
        eventingContext.exchange.type,
        { durable: false },
      );

      for (const queue of Object.values(eventingContext.queues)) {
        await this.channel.assertQueue(queue.name, { durable: false });
        await this.channel.bindQueue(
          queue.name,
          eventingContext.exchange.name,
          queue.routingKey,
        );

        this.logger.info(`Queue ${queue.name} is created or already exists.`);
      }
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ');
    }
  }
  private async disconnect(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
