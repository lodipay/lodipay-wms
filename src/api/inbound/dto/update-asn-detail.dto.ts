import { PartialType } from '@nestjs/swagger';
import { CreateAsnDetailDto } from './create-asn-detail.dto';

export class UpdateAsnDetailDto extends PartialType(CreateAsnDetailDto) {}