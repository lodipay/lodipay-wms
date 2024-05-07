import { IsOptional, IsString } from 'class-validator';

export class CreateGoodsShapeDto {
    @IsString()
    goodsShape: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
