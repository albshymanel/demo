import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { UserEntity } from 'src/users/entities';

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: 'string',
    minLength: UserEntity.nameLength.min,
    maxLength: UserEntity.nameLength.max,
    required: false,
    example: 'Albert2',
  })
  @Length(UserEntity.nameLength.min, UserEntity.nameLength.max)
  @IsOptional()
  name?: string;
}
