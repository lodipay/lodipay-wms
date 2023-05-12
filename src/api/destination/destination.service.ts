import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Destination } from '../../database/entities/destination.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationService {
  constructor(
    @InjectRepository(Destination)
    private readonly destRepo: EntityRepository<Destination>,

    @InjectRepository(Warehouse)
    private readonly whRepo: EntityRepository<Warehouse>,

    private readonly em: EntityManager,
  ) {}

  async create(createDestinationDto: CreateDestinationDto) {
    const dest = new Destination(
      createDestinationDto.name,
      createDestinationDto.description,
    );

    if (createDestinationDto.warehouseId) {
      dest.warehouse = await this.whRepo.findOne(
        createDestinationDto.warehouseId,
      );
    }

    await this.em.persistAndFlush(dest);
    return dest;
  }

  findAll() {
    return this.destRepo.findAll();
  }

  findOne(id: number) {
    return this.destRepo.findOne({ id });
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto) {
    const destination = await this.findOne(id);

    if (updateDestinationDto.warehouseId) {
      destination.warehouse = await this.whRepo.findOne(
        updateDestinationDto.warehouseId,
      );
    }

    this.em.assign(destination, updateDestinationDto, { mergeObjects: true });
    await this.em.persistAndFlush(destination);
    return destination;
  }

  async remove(id: number) {
    const destination = await this.findOne(id);

    if (destination) {
      this.em.removeAndFlush(destination);
    }

    return 'deleted';
  }
}
