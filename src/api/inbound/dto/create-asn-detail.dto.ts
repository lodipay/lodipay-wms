import { OmitType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Asndetail } from '@/database/entities/asn-detail.entity';

export class CreateAsnDetailDto extends OmitType(Asndetail, [
    'id',
    'createdAt',
    'updatedAt',
    'isDelete'
]) {

}
