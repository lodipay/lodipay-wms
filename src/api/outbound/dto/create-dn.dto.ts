import { AsnStatus } from '@/common/enum/asn-status.enum';
import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateDnDto {
    @IsArray()
    goods: Array<{ goodsCode: string; goodsQty: number }>;
    dnCode: string;
    @IsString()
    barCode: string;
    @IsString()
    openId: string;
    backOrderLabel: boolean;
    dnStatus: string;
}
