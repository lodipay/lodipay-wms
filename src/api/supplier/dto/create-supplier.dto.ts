import { OmitType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Supplier } from '../../../database/entities/supplier.entity';
import { SupplierLevel } from '@/common/enum/supplier-level.enum';

export class CreateSupplierDto extends OmitType(Supplier, [
    'id',
    'createdAt',
    'updatedAt',
    'isDelete'
]) {
    @IsString()
    supplierName: string;

    @IsString()
    supplierContact: string;

    @IsNumber()
    supplierManager: number;

    @IsNumber()
    supplierLevel: SupplierLevel;

    @IsString()
    openId: string;

    // @IsNumber()
    // createrId: number;

    supplierCity?: string;
    supplierAddress?: string;
    isDelete?: boolean;

}
