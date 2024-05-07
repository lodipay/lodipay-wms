import { IsOptional, IsString } from 'class-validator';

export class CreateGoodsColorDto {
    @IsString()
    goodsColor: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
