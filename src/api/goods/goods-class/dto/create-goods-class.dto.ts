import { IsOptional, IsString } from 'class-validator';

export class CreateGoodsClassDto {
    @IsString()
    goodsClass: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
