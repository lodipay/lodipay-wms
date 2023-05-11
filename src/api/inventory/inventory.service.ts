import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { FilterService } from '../../common/service/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: EntityRepository<Inventory>,
    private readonly em: EntityManager,
    private readonly filterService: FilterService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const entity = new Inventory();
    this.em.assign(entity, createInventoryDto);
    await this.em.persistAndFlush(entity);

    return entity;
  }

  search(filterDto: FilterDto) {
    return this.filterService.search<Inventory>(Inventory, filterDto);
  }

  findOne(id: number) {
    return this.inventoryRepository.findOne({ id });
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const entity = await this.findOne(id);
    this.em.assign(entity, updateInventoryDto, { mergeObjects: true });
    await this.em.persistAndFlush(entity);

    return entity;
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    if (entity) {
      this.em.removeAndFlush(entity);
    }

    return 'deleted';
  }
}
