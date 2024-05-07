import { IsOptional, IsString } from 'class-validator';

export class CreateGoodsOriginDto {
    @IsString()
    goodsOrigin: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
