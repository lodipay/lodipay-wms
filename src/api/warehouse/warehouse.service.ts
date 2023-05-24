import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { FilterService } from '../../common/module/filter/filter.service';
import { WarehouseInventory } from '../../database/entities/warehouse-inventory.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { AssignWarehouseInventoryDto } from './dto/assign-warehouse-inventory.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseInventoryDto } from './dto/update-warehouse-inventory.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: EntityRepository<Warehouse>,

    @InjectRepository(WarehouseInventory)
    private readonly whInventoryRepo: EntityRepository<WarehouseInventory>,

    private readonly em: EntityManager,

    @Inject(InventoryService)
    private readonly inventoryService: InventoryService,

    private readonly filterService: FilterService,
  ) {}

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = new Warehouse(dto.name, dto.description);
    await this.em.persistAndFlush(warehouse);

    return warehouse;
  }

  findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.findAll();
  }

  findOne(id: number): Promise<Warehouse> {
    return this.warehouseRepository.findOne({ id });
  }

  async update(
    id: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
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

  async assignInventory(
    id: number,
    assignWhInventoryDto: AssignWarehouseInventoryDto,
  ) {
    const inventory = await this.inventoryService.findOne(
      assignWhInventoryDto.inventoryId,
    );

    const warehouseWithSameInventory = await this.whInventoryRepo.findOne({
      warehouse: {
        id,
      },
      inventory: {
        id: assignWhInventoryDto.inventoryId,
      },
    });

    if (warehouseWithSameInventory) {
      throw new InvalidArgumentException(
        'Same inventory already assigned in warehouse',
      );
    }

    const whInventory = new WarehouseInventory();
    whInventory.inventory = inventory;
    whInventory.warehouse = await this.findOne(id);
    whInventory.quantity = assignWhInventoryDto.quantity;
    await this.em.persistAndFlush(whInventory);
    return whInventory;
  }

  async getInventories(id: number, filterDto: FilterDto) {
    return await this.filterService.search<WarehouseInventory>(
      WarehouseInventory,
      filterDto,
    );
  }

  async getInventory(id: number, inventoryId: number) {
    return await this.whInventoryRepo.findOne({
      id,
      inventory: { id: inventoryId },
    });
  }

  async updateInventory(
    warehouseId: number,
    inventoryId: number,
    updateWarehouseInventoryDto: UpdateWarehouseInventoryDto,
  ) {
    const whInventory = await this.whInventoryRepo.findOne({
      warehouse: {
        id: warehouseId,
      },
      inventory: {
        id: inventoryId,
      },
    });

    whInventory.quantity = updateWarehouseInventoryDto.quantity;
    await this.em.persistAndFlush(whInventory);
    return whInventory;
  }

  async removeInventory(warehouseId: number, inventoryId: number) {
    const whInventory = await this.whInventoryRepo.findOne({
      warehouse: {
        id: warehouseId,
      },
      inventory: {
        id: inventoryId,
      },
    });

    if (!whInventory) {
      throw new InvalidArgumentException('Warehouse inventory not found');
    }

    await this.em.removeAndFlush(whInventory);
  }
}
