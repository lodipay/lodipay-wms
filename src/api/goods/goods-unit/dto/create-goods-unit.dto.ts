import { IsOptional, IsString } from 'class-validator';

export class CreateGoodsUnitDto {
    @IsString()
    goodsUnit: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
