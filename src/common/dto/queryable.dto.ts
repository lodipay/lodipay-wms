import { ApiProperty } from '@nestjs/swagger';

export class QueryableDto {
    @ApiProperty({ nullable: true })
    $eq?: string;

    @ApiProperty({ nullable: true })
    $in?: string;

    @ApiProperty({ nullable: true })
    $nin?: string;

    @ApiProperty({ nullable: true })
    $gt?: string;

    @ApiProperty({ nullable: true })
    $gte?: string;

    @ApiProperty({ nullable: true })
    $lt?: string;

    @ApiProperty({ nullable: true })
    $lte?: string;

    @ApiProperty({ nullable: true })
    $ne?: string;

    @ApiProperty({ nullable: true })
    $not?: string;

    @ApiProperty({ nullable: true })
    $like?: string;

    @ApiProperty({ nullable: true })
    $re?: string;

    @ApiProperty({ nullable: true })
    $fulltext?: string;

    @ApiProperty({ nullable: true })
    $exists?: string;

    @ApiProperty({ nullable: true })
    $ilike?: string;

    @ApiProperty({ nullable: true })
    $overlap?: string;

    @ApiProperty({ nullable: true })
    $contains?: string;

  @ApiProperty({ nullable: true })
  $contained?: string;

  [key: string]: any;
}
