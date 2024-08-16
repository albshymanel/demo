import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { eventingContext } from 'src/eventing';
import { UserCreatedDto, UserDeletedDto } from './dto';
import {
  INotificationsService,
  NOTIFICATIONS_SERVICE,
} from './notifications.service.interface';

@Controller()
export class NotificationsController {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly service: INotificationsService,
  ) {}
  @EventPattern(eventingContext.queues.userCreated.routingKey)
  async handleUserCreated(@Payload() dto: UserCreatedDto) {
    await this.service.handleUserCreated(dto);
  }

  @EventPattern(eventingContext.queues.userDeleted.routingKey)
  async handleQueueTwoMessage(@Payload() dto: UserDeletedDto) {
    await this.service.handleUserDeleted(dto);
  }
}
