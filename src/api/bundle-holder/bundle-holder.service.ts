import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { FilterService } from '../../common/module/filter/filter.service';
import { BundleHolder } from '../../database/entities/bundle-holder.entity';
import { CreateBundleHolderDto } from './dto/create-bundle-holder.dto';
import { UpdateBundleHolderDto } from './dto/update-bundle-holder.dto';

@Injectable()
export class BundleHolderService {
    constructor(
        @InjectRepository(BundleHolder)
        private readonly bundleHolderRepo: EntityRepository<BundleHolder>,

        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create({ name, description }: CreateBundleHolderDto) {
        const bundleHolder = new BundleHolder();
        bundleHolder.name = name;
        bundleHolder.description = description;
        await this.em.persistAndFlush(bundleHolder);
        return bundleHolder;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<BundleHolder>(BundleHolder, filterDto);
    }

    async findOne(id: number) {
        const bundleHolder = await this.bundleHolderRepo.findOne(id);

        if (!bundleHolder) {
            throw new InvalidArgumentException('Invalid bundle holder');
        }
        return bundleHolder;
    }

    async update(id: number, dto: UpdateBundleHolderDto) {
        const bundleHolder = await this.findOne(id);
        bundleHolder.name = dto.name || bundleHolder.name;
        bundleHolder.name = dto.description || bundleHolder.description;
        await this.em.persistAndFlush(bundleHolder);

        return bundleHolder;
    }

    async remove(id: number) {
        const bundleHolder = await this.findOne(id);

        await this.em.removeAndFlush(bundleHolder);
        return 'success';
    }
}
