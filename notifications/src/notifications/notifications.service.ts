import { Injectable } from '@nestjs/common';
import { INotificationsService } from './notifications.service.interface';
import { UserCreatedDto, UserDeletedDto } from './dto';

@Injectable()
export class NotificationsService implements INotificationsService {
  constructor() {}
  async handleUserCreated(dto: UserCreatedDto): Promise<void> {
    console.log('User created: ' + JSON.stringify(dto));
  }
  async handleUserDeleted(dto: UserDeletedDto): Promise<void> {
    console.log('User deleted: ' + JSON.stringify(dto));
  }
}
