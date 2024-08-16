export class UserEntity {
  static nameLength = { min: 2, max: 30 };
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
