import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { FilterService } from '../../common/module/filter/filter.service';
import { Bundle } from '../../database/entities/bundle.entity';
import { BundleHolderService } from '../bundle-holder/bundle-holder.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';

@Injectable()
export class BundleService {
    constructor(
        @InjectRepository(Bundle)
        private readonly bundleRepository: EntityRepository<Bundle>,
        private readonly em: EntityManager,

        @Inject(BundleHolderService)
        private readonly bundleHolderService: BundleHolderService,

        @Inject(InventoryService)
        private readonly inventoryService: InventoryService,

        private readonly filterService: FilterService,
    ) {}

    async create(dto: CreateBundleDto): Promise<Bundle> {
        try {
            const inventory = await this.inventoryService.findOne(
                dto.inventoryId,
            );

            const bundleHolder = await this.bundleHolderService.findOne(
                dto.bundleHolderId,
            );

            const bundle = new Bundle();
            bundle.inventories.add(inventory);
            bundle.bundleHolder = bundleHolder;
            bundle.bundleQuantity = dto.inventoryQuantity;

            delete dto.bundleHolderId;
            delete dto.inventoryId;

            const newBundle = this.em.assign(bundle, dto);
            await this.em.persistAndFlush(newBundle);

            return newBundle;
        } catch (error) {
            console.log(error);
        }
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Bundle>(Bundle, filterDto);
    }

    findOne(id: number): Promise<Bundle> {
        return this.bundleRepository.findOne({ id });
    }

    async update(
        id: number,
        updateBundleDto: UpdateBundleDto,
    ): Promise<Bundle> {
        const bundle = await this.findOne(id);
        this.em.assign(bundle, updateBundleDto, { mergeObjects: true });

        await this.em.persistAndFlush(bundle);

        return bundle;
    }

    async remove(id: number) {
        const bundle = await this.findOne(id);

        if (bundle) {
            await this.em.removeAndFlush(bundle);
        }

        return 'success';
    }
}
