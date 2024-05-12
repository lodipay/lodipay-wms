import { PartialType } from '@nestjs/swagger';
import { CreateDnDetailDto } from './create-dn-detail.dto';

export class UpdateDnDetailDto extends PartialType(CreateDnDetailDto) {}