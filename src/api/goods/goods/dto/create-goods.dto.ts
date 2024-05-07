import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGoodsDto {
    @IsString()
    goodsCode: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;

    @IsString()
    goodsDesc!: string;

    @IsString()
    goodsSupplier!: string;

    @IsNumber()
    goodsWeight!: number;

    @IsNumber()
    goodsW!: number;

    @IsNumber()
    goodsD!: number;

    @IsNumber()
    goodsH!: number;

    @IsNumber()
    unitVolume?: number;

    @IsNumber()
    goodsUnit: number;

    @IsNumber()
    goodsClass: number;

    @IsNumber()
    goodsBrand: number;

    @IsNumber()
    goodsColor: number;

    @IsNumber()
    goodsShape: number;

    @IsNumber()
    goodsSpecs: number;

    @IsOptional()
    @IsNumber()
    goodsOrigin?: number;

    @IsNumber()
    safetyStock!: number;

    @IsOptional()
    @IsNumber()
    goodsCost: number;

    @IsNumber()
    goodsPrice: number;

    @IsOptional()
    @IsString()
    barCode?: string;
}
