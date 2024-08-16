import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiOkResponsePaginated,
  PaginationRequest,
  PaginationResponse,
} from '../lib';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { IUsersService, USERS_SERVICE } from './user.service.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject(USERS_SERVICE) private readonly service: IUsersService) {}

  @ApiOkResponsePaginated(UserDto)
  @Get('/')
  async findMany(
    @Query() dto: PaginationRequest,
  ): Promise<PaginationResponse<UserDto>> {
    return await this.service.findMany(dto).then((r) => ({
      ...r,
      items: r.items.map(UserDto.fromEntity),
    }));
  }

  @ApiOkResponse({
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return await this.service.findOne(id).then(UserDto.fromEntity);
  }

  @ApiCreatedResponse({
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({ description: 'User with such email already exists' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return await this.service.create(dto).then(UserDto.fromEntity);
  }

  @ApiOkResponse({
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({ description: 'User with such email already exists' })
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.service.update(id, dto);
  }

  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.service.remove(id);
  }
}
