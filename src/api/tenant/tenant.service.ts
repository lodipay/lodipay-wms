import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { FilterService } from '../../common/module/filter/filter.service';
import { Tenant } from '../../database/entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
    constructor(
        @InjectRepository(Tenant)
        private readonly tenantRepo: EntityRepository<Tenant>,

        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create({ name, description }: CreateTenantDto) {
        const tenant = new Tenant();
        tenant.name = name;
        tenant.description = description;
        await this.em.persistAndFlush(tenant);
        return tenant;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Tenant>(Tenant, filterDto);
    }

    async findOne(id: number) {
        const tenant = await this.tenantRepo.findOne(id);

        if (!tenant) {
            throw new InvalidArgumentException('Invalid tenant');
        }
        return tenant;
    }

    async update(id: number, dto: UpdateTenantDto) {
        const tenant = await this.findOne(id);
        tenant.name = dto.name || tenant.name;
        tenant.description = dto.description || tenant.description;

        await this.em.persistAndFlush(tenant);

        return tenant;
    }

    async remove(id: number) {
        const tenant = await this.findOne(id);
        await this.em.removeAndFlush(tenant);
        return 'success';
    }
}
