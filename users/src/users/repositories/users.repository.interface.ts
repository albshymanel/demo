import { UserEntity } from '../entities';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface IUsersRepository {
  findMany(
    limit: number,
    offset: number,
  ): Promise<{ totalCount: number; users: Array<UserEntity> }>;
  findOne(id: string): Promise<UserEntity | null>;
  checkExistingUserByEmail(email: string): Promise<boolean>;
  create(user: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity>;
  update(
    id: string,
    user: Partial<Omit<UserEntity, 'id' | 'createdAt'>>,
  ): Promise<UserEntity>;
  remove(id: string): Promise<boolean>;
}
