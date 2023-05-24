import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
    @ApiProperty()
    total: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    totalPage: number;

    result: any;
}
