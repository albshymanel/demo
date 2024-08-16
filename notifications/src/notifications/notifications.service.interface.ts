import { UserCreatedDto, UserDeletedDto } from './dto';

export const NOTIFICATIONS_SERVICE = Symbol('NotificationsService');

export interface INotificationsService {
  handleUserCreated(dto: UserCreatedDto): Promise<void>;
  handleUserDeleted(dto: UserDeletedDto): Promise<void>;
}
