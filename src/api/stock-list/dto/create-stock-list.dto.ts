import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStocckListDto {
    @IsString()
    goodsCode: string;

    @IsString()
    goodsDesc: string;
    
    @IsNumber()
    goodsQty: number;

    @IsNumber()
    onhandStock: number;

    @IsNumber()
    canOrderStock: number;

    @IsNumber()
    orderedStock: number;

    @IsNumber()
    inspectStock: number;

    @IsNumber()
    holdStock: number;

    @IsNumber()
    damageStock: number;

    @IsNumber()
    asnStock: number;

    @IsNumber()
    dnStock: number;

    @IsNumber()
    preLoadStock: number;

    @IsNumber()
    preSortStock: number;

    @IsNumber()
    sortedStock: number;

    @IsNumber()
    pickStock: number;

    @IsNumber()
    pickedStock: number;

     @IsNumber()
    backOrderStock: number; 

    @IsNumber()
    supplier: number;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
