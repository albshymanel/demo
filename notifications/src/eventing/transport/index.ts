import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';

interface RabbitMQTransportOptions {
  username: string;
  password: string;
  hostname: string;
  port: number;
  protocol: string;
  queue: string;
  exchange: string;
  exchangeType: string;
  routingKey: string;
}

export class CustomRabbitMQTransport
  extends Server
  implements CustomTransportStrategy
{
  private server: Connection;
  private channel: Channel;
  private readonly options: RabbitMQTransportOptions;

  constructor(options: RabbitMQTransportOptions) {
    super();
    this.options = options;
  }

  async listen(callback: () => void) {
    this.server = await connect({
      username: this.options.username,
      password: this.options.password,
      hostname: this.options.hostname,
      port: this.options.port,
      protocol: this.options.protocol,
      heartbeat: 5,
    });
    this.channel = await this.server.createChannel();

    await this.channel.assertQueue(this.options.queue, { durable: false });

    await this.channel.assertExchange(
      this.options.exchange,
      this.options.exchangeType,
      {
        durable: false,
      },
    );

    await this.channel.bindQueue(
      this.options.queue,
      this.options.exchange,
      this.options.routingKey,
    );
    await this.channel.consume(
      this.options.queue,
      this.handleMessage.bind(this),
      { noAck: true },
    );

    callback();
  }

  async close() {
    await this.channel.close();
    await this.server.close();
  }

  private async handleMessage(message: ConsumeMessage) {
    const content = message.content.toString();
    const pattern = message.fields.routingKey;

    const handler = this.getHandlerByPattern(pattern);

    if (handler) await handler(JSON.parse(content));
    else throw new Error(' handler not found routing-key: ' + pattern);
  }
}
