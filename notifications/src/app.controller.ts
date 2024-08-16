import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck(): void {
    console.log('health check');
    return;
  }
}
