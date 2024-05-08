import { PartialType } from '@nestjs/swagger';
import { CreateAsnDto } from './create-asn.dto';

export class UpdateAsnDto extends PartialType(CreateAsnDto) {}
