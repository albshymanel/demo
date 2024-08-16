import { Inject } from '@nestjs/common';

import {
  LOGGER_OPTIONS_TOKEN,
  LoggerModuleOptions,
} from './logger.options.interface';
import { ILoggerService } from './logger.service.interface';

export class ConsoleLoggerService implements ILoggerService {
  constructor(
    @Inject(LOGGER_OPTIONS_TOKEN)
    private readonly options: LoggerModuleOptions,
  ) {}

  public debug(message: any): void {
    this.log('DEBUG', message);
  }
  public info(message: any): void {
    this.log('INFO', message);
  }
  public notice(message: any): void {
    this.log('NOTICE', message);
  }
  public warning(message: any): void {
    this.log('WARNING', message);
  }
  public error(message: any): void {
    this.log('ERROR', message);
  }
  public critical(message: any): void {
    this.log('CRITICAL', message);
  }
  public alert(message: any): void {
    this.log('ALERT', message);
  }
  public emergency(message: any): void {
    this.log('EMERGENCY', message);
  }
  private log(level: string, message: any): void {
    console.log(
      `${this.options.startSymbol}${level}: ${JSON.stringify(message)}`,
    );
  }
}
