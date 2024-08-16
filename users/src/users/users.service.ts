import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eventingContext, EVENTS_SERVICE, IEventsService } from 'src/eventing';
import { ILoggerService, LOGGER_SERVICE } from 'src/lib/logger';
import { PaginationRequest, PaginationResponse } from '../lib';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from './repositories/users.repository.interface';
import { IUsersService } from './user.service.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly repository: IUsersRepository,

    @Inject(LOGGER_SERVICE) private readonly logger: ILoggerService,
    @Inject(EVENTS_SERVICE) private readonly eventsService: IEventsService,
  ) {}
  async findMany(
    dto: PaginationRequest,
  ): Promise<PaginationResponse<UserEntity>> {
    return this.repository.findMany(dto.limit, dto.offset).then((r) => ({
      totalCount: r.totalCount,
      items: r.users,
      offset: dto.offset,
      limit: dto.limit,
    }));
  }
  async findOne(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existingUserWithNewEmail =
      await this.repository.checkExistingUserByEmail(dto.email);
    if (existingUserWithNewEmail)
      throw new ConflictException('user with such email already exists');

    const createdUser = await this.repository.create(dto);

    await this.eventsService.send(
      eventingContext.exchange.name,
      eventingContext.queues.userCreated.routingKey,
      createdUser,
    );
    this.logger.info(`user created ${JSON.stringify(createdUser)}`);

    return createdUser;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.repository.findOne(id);
    if (!user) throw new NotFoundException('user not found');

    if (dto.email) {
      const existingUserWithNewEmail =
        await this.repository.checkExistingUserByEmail(dto.email);
      if (existingUserWithNewEmail && dto.email !== user.email)
        throw new ConflictException('user with such email already exists');
    }

    const updatedUser = await this.repository.update(id, dto);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.repository.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    await this.repository.remove(id);

    await this.eventsService.send(
      eventingContext.exchange.name,
      eventingContext.queues.userDeleted.routingKey,
      {
        id,
      },
    );
    this.logger.info(`user deleted ${id}`);
  }
}
