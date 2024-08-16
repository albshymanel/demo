import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsService } from './events.service';
import { EVENTS_SERVICE } from './events.service.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: EVENTS_SERVICE,
      useClass: EventsService,
    },
  ],
  exports: [
    {
      provide: EVENTS_SERVICE,
      useClass: EventsService,
    },
  ],
})
export class EventsModule {}
