import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities';

export class UserDto {
  @ApiProperty({
    type: 'string',
    required: true,
  })
  id: string;

  @ApiProperty({
    type: 'string',
    format: 'email',
    required: true,
  })
  email: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Albert',
  })
  name: string;

  static fromEntity(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
    };
  }
}
