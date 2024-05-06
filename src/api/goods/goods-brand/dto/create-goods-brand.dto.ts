import { OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GoodsBrand } from '../../../../database/entities/goods-brand.entity';

export class CreateGoodsBrandDto extends OmitType(GoodsBrand, [
    'id',
    'createdAt',
    'updatedAt',
    'isDelete',
]) {
    @IsString()
    goodsBrand: string;

    @IsOptional()
    @IsString()
    creater?: string;

    @IsString()
    openid: string;
}
