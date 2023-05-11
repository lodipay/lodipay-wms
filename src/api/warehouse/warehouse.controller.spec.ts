import { Collection } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerMockConfig, getRepositoryMockConfig } from '../../common/mock';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

describe('WarehouseController', () => {
  let controller: WarehouseController;
  let warehouseService: WarehouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseController],
      providers: [
        WarehouseService,
        getEntityManagerMockConfig(),
        getRepositoryMockConfig(Warehouse),
      ],
    }).compile();

    controller = module.get<WarehouseController>(WarehouseController);
    warehouseService = module.get<WarehouseService>(WarehouseService);
  });

  it('create', async () => {
    const data = {
      name: 'WH1',
      description: 'WH1 description',
    };
    jest.spyOn(warehouseService, 'create').mockImplementation((dto: CreateWarehouseDto) => {
      const warehouse = new Warehouse(dto.name, dto.description);
      warehouse.id = 1;

      return Promise.resolve(warehouse);
    });

    const result = await controller.create(data);
    expect(result).toBeInstanceOf(Warehouse);
    expect(result.id).toBe(1);
    expect(result.name).toBe(data.name);
    expect(result.description).toBe(data.description);
    expect(result.locations).toBeInstanceOf(Collection<Location>);
    expect(result.locations).toHaveLength(0);
  });

  it('findAll', async () => {
    const result = [
      new Warehouse('WH1', 'WH1 description'),
      new Warehouse('WH2', 'WH2 description'),
    ];
    jest.spyOn(warehouseService, 'findAll').mockImplementation(() => Promise.resolve(result));
    expect(await controller.findAll()).toBe(result);
  });

  it('findOne', async () => {
    const result = new Warehouse('WH1', 'WH1 description');
    jest.spyOn(warehouseService, 'findOne').mockImplementation((id: number) => {
      result.id = id;
      return Promise.resolve(result);
    });
    expect(await controller.findOne('1')).toBe(result);
  });

  it('update', async () => {
    const result = new Warehouse('WH1-1', 'WH1 description');
    result.id = 1;

    jest.spyOn(warehouseService, 'update').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(
      await controller.update(
        '1',
        new UpdateWarehouseDto({
          name: 'WH1-1',
        }),
      ),
    ).toBe(result);
  });

  it('remove', async () => {
    const result = 'deleted';
    jest.spyOn(warehouseService, 'remove').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });
});
