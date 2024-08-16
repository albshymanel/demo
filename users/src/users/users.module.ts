import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from 'src/eventing';
import { MongoUsersRepository } from './repositories/mongo.users.repository';
import { User, UserSchema } from './repositories/shemas';
import { USERS_REPOSITORY } from './repositories/users.repository.interface';
import { USERS_SERVICE } from './user.service.interface';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    EventsModule,
  ],
  providers: [
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: MongoUsersRepository,
    },
  ],
  exports: [
    {
      provide: USERS_SERVICE,
      useClass: UsersService,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: MongoUsersRepository,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
