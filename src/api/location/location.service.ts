import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Location } from '../../database/entities/location.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: EntityRepository<Location>,
        @InjectRepository(Warehouse)
        private readonly warehouseRepository: EntityRepository<Warehouse>,

        private readonly em: EntityManager,
    ) {}

    async create({ code, warehouseId, description }: CreateLocationDto) {
        const warehouse = await this.warehouseRepository.findOne(warehouseId);

        const location = new Location(code, warehouse, description);

        return await this.locationRepository.upsert(location);
    }

    async findAll() {
        return await this.locationRepository.findAll();
    }

    async findOne(id: number) {
        return await this.locationRepository.findOne({
            id,
        });
    }

    async update(id: number, updateLocationDto: UpdateLocationDto) {
        const location = await this.findOne(id);
        this.em.assign(location, updateLocationDto, { mergeObjects: true });

        await this.em.persistAndFlush(location);
        return location;
    }

    async remove(id: number) {
        const location = await this.findOne(id);

        if (location) {
            await this.em.removeAndFlush(location);
        }

        return 'deleted';
    }
}
