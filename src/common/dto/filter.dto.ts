import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QueryDto } from '../../common/dto/query.dto';

export class FilterDto {
    @ApiProperty({ required: false, example: '20', default: 20 })
    limit?: number = 20;
    @ApiProperty({ required: false, example: '1', default: 1 })
    page?: number = 1;

    @ApiPropertyOptional()
    //     {
    //     name: 'query',
    //     type: 'object',
    //     example: {
    //         query: {
    //             filter: {
    //                 name: {
    //                     $ilike: '%tasty%',
    //                 },
    //             },
    //             order: {
    //                 name: QueryOrder.DESC,
    //             },
    //             populate: [],
    //         },
    //     },
    // }
    query?: QueryDto = new QueryDto();
}
