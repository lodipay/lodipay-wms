import { OmitType } from '@nestjs/swagger';
import { Dndetail } from '@/database/entities/dn-detail.entity';

export class CreateDnDetailDto extends OmitType(Dndetail, [
    'id',
    'createdAt',
    'updatedAt',
    'isDelete'
]) {

}
