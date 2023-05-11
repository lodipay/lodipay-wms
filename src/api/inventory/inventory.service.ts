import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/common/dto/filter.dto';
import { FilterService } from '../../common/service/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private readonly inventoryRepository: EntityRepository<Inventory>,
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
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
