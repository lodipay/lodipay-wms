import { IsOptional, IsString } from 'class-validator';

export class CreateGoodsSpecsDto {
    @IsString()
    goodsSpecs: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
