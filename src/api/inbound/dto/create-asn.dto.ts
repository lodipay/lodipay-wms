import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Supplier } from '../../../database/entities/supplier.entity';
import { Collection } from '@mikro-orm/core';
import { Goods } from '@/database/entities/goods.entity';

export class CreateAsnDto extends OmitType(Supplier, [
    'id',
    'createdAt',
    'updatedAt',
    'isDelete'
]) {
    @IsArray()
    goods: Collection<Goods>;
    @IsString()
    supplierName: string;
    @IsNumber()
    totalQty: number;
    @IsString()
    openId: string;

}
