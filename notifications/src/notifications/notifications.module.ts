import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NOTIFICATIONS_SERVICE } from './notifications.service.interface';

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [
    {
      provide: NOTIFICATIONS_SERVICE,
      useClass: NotificationsService,
    },
  ],
})
export class NotificationsModule {}
