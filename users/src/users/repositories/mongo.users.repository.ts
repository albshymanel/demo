import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { UserEntity } from '../entities';
import { User } from './shemas';
import { IUsersRepository } from './users.repository.interface';

export class MongoUsersRepository implements IUsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<User>,
  ) {}

  async findMany(
    limit: number,
    offset: number,
  ): Promise<{ totalCount: number; users: Array<UserEntity> }> {
    const [docs, totalCount] = await Promise.all([
      this.model.find().limit(limit).skip(offset).lean(),
      this.model.countDocuments(),
    ]);
    return {
      totalCount,
      users: docs.map(this.mongoDocumentToEntity),
    };
  }
  async findOne(id: string): Promise<UserEntity | null> {
    const doc = await this.model.findById(id).lean();
    if (!doc) return null;
    return this.mongoDocumentToEntity(doc);
  }
  async checkExistingUserByEmail(email: string): Promise<boolean> {
    return this.model.exists({ email }).then((r) => !!r);
  }
  async create(
    user: Omit<UserEntity, 'id' | 'createdAt'>,
  ): Promise<UserEntity> {
    const createdDocument = await this.model.create(user);
    return this.mongoDocumentToEntity(createdDocument);
  }
  async update(
    id: string,
    user: Partial<Omit<UserEntity, 'id' | 'createdAt'>>,
  ): Promise<UserEntity> {
    const updatedDocument = await this.model.findOneAndUpdate(
      { _id: id },
      user,
      {
        new: true,
      },
    );
    if (!updatedDocument) throw new Error('db update error');
    return this.mongoDocumentToEntity(updatedDocument);
  }
  async remove(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete({ _id: id }).lean();
    return !!result;
  }

  private mongoDocumentToEntity(
    doc: FlattenMaps<User> & {
      _id: Types.ObjectId;
    },
  ): UserEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      createdAt: doc.createdAt,
    };
  }
}
