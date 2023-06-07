import { OmitType } from '@nestjs/swagger';
import { Tenant } from '../../../database/entities/tenant.entity';

export class UpdateTenantDto extends OmitType(Tenant, [
    'id',
    'createdAt',
    'updatedAt',
    'tenantItems',
]) {}
