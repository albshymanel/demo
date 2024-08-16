import { Controller, Get, Inject } from '@nestjs/common';
import { LOGGER_SERVICE, ILoggerService } from './lib/logger';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILoggerService,
  ) {}

  @ApiOkResponse({ description: 'health check' })
  @Get()
  healthCheck(): void {
    this.logger.info('health check');
    return;
  }
}
