import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Collection } from '@mikro-orm/core';
import { Goods } from '@/database/entities/goods.entity';
import { Asnlist } from '@/database/entities/asnlist.entity';

export class CreateAsnDto extends OmitType(Asnlist, [
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
