import { PaginationRequest, PaginationResponse } from '../lib';
import { UpdateUserDto } from './dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserEntity } from './entities';

export const USERS_SERVICE = Symbol('UsersService');

export interface IUsersService {
  findMany(dto: PaginationRequest): Promise<PaginationResponse<UserEntity>>;
  findOne(id: string): Promise<UserEntity>;
  create(dto: CreateUserDto): Promise<UserEntity>;
  update(id: string, dto: UpdateUserDto): Promise<UserEntity>;
  remove(id: string): Promise<void>;
}
