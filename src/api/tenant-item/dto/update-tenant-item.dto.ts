import { OmitType } from '@nestjs/swagger';
import { CreateTenantItemDto } from './create-tenant-item.dto';

export class UpdateTenantItemDto extends OmitType(CreateTenantItemDto, []) {}
