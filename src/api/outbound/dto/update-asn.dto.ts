import { PartialType } from '@nestjs/swagger';
import { CreateDnDto } from './create-dn.dto';

export class UpdateDnDto extends PartialType(CreateDnDto) {}
