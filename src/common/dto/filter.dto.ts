import { QueryOrder } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { QueryDto } from '../../common/dto/query.dto';

export class FilterDto {
  @ApiProperty({ required: false, example: '20' })
  limit?: number;
  @ApiProperty({ required: false, example: '1' })
  page?: number;

  @ApiProperty({
    name: 'query',
    type: 'object',
    example: {
      query: {
        filter: {
          name: {
            $ilike: '%tasty%',
          },
        },
        order: {
          name: QueryOrder.DESC,
        },
      },
    },
  })
  query: QueryDto;
}
