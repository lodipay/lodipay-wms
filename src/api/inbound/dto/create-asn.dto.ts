import { AsnStatus } from '@/common/enum/asn-status.enum';
import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateAsnDto {
    @IsArray()
    goods: Array<{ goodsCode: string; goodsQty: number }>;
    asnCode: string;
    @IsString()
    supplierName: string;
    @IsString()
    barCode: string;
    @IsString()
    openId: string;

    asnStatus?: AsnStatus;
}
