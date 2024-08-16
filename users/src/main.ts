import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ILoggerService, LOGGER_SERVICE } from './lib/logger';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<ILoggerService>(LOGGER_SERVICE);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Ticher docs')
    .setDescription('The ticher app API description')
    .setVersion('1.0')
    .addTag('ticher')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, '0.0.0.0').then(() => {
    logger.info(`Application started port: ${port}`);
  });
}
bootstrap();
