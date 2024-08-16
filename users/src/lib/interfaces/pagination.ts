import { Type as NestType, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PaginationRequest {
  static defaultLimit = 10;
  @ApiProperty({
    type: 'integer',
    example: 0,
    default: 0,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  offset: number = 0;
  @ApiProperty({
    type: 'integer',
    example: 10,
    default: PaginationRequest.defaultLimit,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  limit: number = PaginationRequest.defaultLimit;
}

export class PaginationResponse<T> {
  @ApiProperty({
    type: 'integer',
    example: 10,
  })
  totalCount: number;

  @ApiProperty({
    type: 'integer',
    example: 10,
  })
  offset: number;

  @ApiProperty({
    type: 'integer',
    example: 10,
  })
  limit: number;

  @ApiProperty()
  items: Array<T>;
}

export const ApiOkResponsePaginated = <DataDto extends NestType<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
