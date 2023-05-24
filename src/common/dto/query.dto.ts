import { QueryOrder } from '@mikro-orm/core';
import { QueryableDto } from './queryable.dto';

export class QueryDto {
    filter: {
        [key: string]: QueryableDto;
    };

    order: {
        [key: string]: QueryOrder;
    };
}
