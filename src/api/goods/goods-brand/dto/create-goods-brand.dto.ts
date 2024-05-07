import { IsOptional, IsString } from 'class-validator';

export class CreateGoodsBrandDto {
    @IsString()
    goodsBrand: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
