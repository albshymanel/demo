import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CustomRabbitMQTransport, eventingContext } from './eventing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new CustomRabbitMQTransport({
      username: configService.get<string>('RABBIT_USERNAME'),
      password: configService.get<string>('RABBIT_PASSWORD'),
      hostname: configService.get<string>('RABBIT_HOST'),
      port: configService.get<number>('RABBIT_PORT'),
      protocol: configService.get<string>('RABBIT_PROTOCOL'),
      exchange: eventingContext.exchange.name,
      exchangeType: eventingContext.exchange.type,
      routingKey: eventingContext.queues.userCreated.routingKey,
      queue: eventingContext.queues.userCreated.name,
    }),
  });
  app.connectMicroservice<MicroserviceOptions>({
    strategy: new CustomRabbitMQTransport({
      username: configService.get<string>('RABBIT_USERNAME'),
      password: configService.get<string>('RABBIT_PASSWORD'),
      hostname: configService.get<string>('RABBIT_HOST'),
      port: configService.get<number>('RABBIT_PORT'),
      protocol: configService.get<string>('RABBIT_PROTOCOL'),
      exchange: eventingContext.exchange.name,
      exchangeType: eventingContext.exchange.type,
      routingKey: eventingContext.queues.userDeleted.routingKey,
      queue: eventingContext.queues.userDeleted.name,
    }),
  });

  await app.startAllMicroservices();
  await app.listen(port, '0.0.0.0').then(() => {
    console.log(`Application started port: ${port}`);
  });
}
bootstrap();
