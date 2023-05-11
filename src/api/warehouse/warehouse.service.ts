import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Destination } from '../../database/entities/destination.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: EntityRepository<Warehouse>,

    @InjectRepository(Destination)
    private readonly destinationRepository: EntityRepository<Destination>,

    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = new Warehouse(dto.name, dto.description);
    const destination = await this.destinationRepository.findOne({
      id: dto.destinationId,
    });

    warehouse.destination = destination;
    await this.em.persistAndFlush(warehouse);

    return warehouse;
  }

  findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.findAll();
  }

  findOne(id: number): Promise<Warehouse> {
    return this.warehouseRepository.findOne({ id });
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    this.em.assign(warehouse, updateWarehouseDto, { mergeObjects: true });

    await this.em.persistAndFlush(warehouse);

    return warehouse;
  }

  async remove(id: number) {
    const warehouse = await this.findOne(id);

    if (warehouse) {
      await this.em.removeAndFlush(warehouse);
    }

    return 'success';
  }
}
