import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { UserEntity } from 'src/users/entities';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    minLength: UserEntity.nameLength.min,
    maxLength: UserEntity.nameLength.max,
    required: true,
    example: 'Albert',
  })
  @Length(UserEntity.nameLength.min, UserEntity.nameLength.max)
  @IsNotEmpty()
  name: string;
}
