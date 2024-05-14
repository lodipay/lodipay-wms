import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class StockDto {
    @IsNumber()
    supplier: number;

    @IsString()
    goodsCode: string;
}

export class CreateStockListHoldDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    stocks: StockDto[];

    @IsOptional()
    creater?: string;

    @IsOptional()
    openid?: string;
}