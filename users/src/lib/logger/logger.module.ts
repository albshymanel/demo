import { DynamicModule, Global, Module } from '@nestjs/common';
import { LOGGER_SERVICE } from './logger.service.interface';
import { ConsoleLoggerService } from './console-logger.service';
import {
  LOGGER_OPTIONS_TOKEN,
  LoggerModuleAsyncOptions,
} from './logger.options.interface';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      imports: options.imports,
      providers: [
        {
          provide: LOGGER_OPTIONS_TOKEN,
          inject: options.inject || [],
          useFactory: options.useFactory,
        },
        {
          provide: LOGGER_SERVICE,
          useClass: ConsoleLoggerService,
        },
      ],
      exports: [
        {
          provide: LOGGER_SERVICE,
          useClass: ConsoleLoggerService,
        },
      ],
    };
  }
}
