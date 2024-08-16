import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from './lib/logger';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './eventing/events.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    LoggerModule.forRoot({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          startSymbol: configService.get<string>('LOGGER_SYMBOL'),
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          user: configService.get<string>('MONGO_USERNAME'),
          pass: configService.get<string>('MONGO_PASSWORD'),
          uri: `mongodb://${configService.get<string>('MONGO_HOST')}`,
          dbName: configService.get<string>('MONGO_DB'),
        };
      },
    }),
    EventsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
