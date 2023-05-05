import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: EntityRepository<Warehouse>,
  ) {}

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = new Warehouse(dto.name, dto.description);

    await this.warehouseRepository.persistAndFlush(warehouse);

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
    wrap(warehouse).assign(updateWarehouseDto);
    await this.warehouseRepository.persistAndFlush(warehouse);

    return warehouse;
  }

  remove(id: number) {
    return `This action removes a #${id} warehouse`;
  }
}
