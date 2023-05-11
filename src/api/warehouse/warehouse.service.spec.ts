import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerMockConfig, getRepositoryMockConfig } from '../../common/mock';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { WarehouseService } from './warehouse.service';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let em: EntityManager;
  let repository: EntityRepository<Warehouse>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        getEntityManagerMockConfig(),
        getRepositoryMockConfig<Warehouse>(Warehouse),
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
    em = module.get<EntityManager>(EntityManager);
    repository = module.get<EntityRepository<Warehouse>>(getRepositoryToken(Warehouse));
  });

  it('create', async () => {
    const dto = new CreateWarehouseDto('WH1', 'WH1 description');

    const result = new Warehouse(dto.name, dto.description);

    jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Warehouse) => {
      result.id = obj.id = 3;

      return Promise.resolve();
    });

    expect(await service.create(dto)).toStrictEqual(result);
  });

  it('findAll', async () => {
    const result = [
      new Warehouse('WH1', 'WH1 description'),
      new Warehouse('WH2', 'WH2 description'),
    ];

    jest.spyOn(repository, 'findAll').mockImplementation((): any => {
      return Promise.resolve(result);
    });

    expect(await service.findAll()).toStrictEqual(result);
  });

  it('findOne', async () => {
    const result = new Warehouse('WH1', 'WH1 description');
    result.id = 3;

    jest.spyOn(repository, 'findOne').mockImplementation((options: any): any => {
      expect(options.id).toBe(result.id);
      return Promise.resolve(result);
    });

    expect(await service.findOne(3)).toStrictEqual(result);
  });

  it('update', async () => {
    const result = {
      id: 3,
      name: 'WH1',
      description: 'WH1 description',
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => {
      const warehouse = new Warehouse(result.name, result.description);
      warehouse.id = result.id;

      return Promise.resolve(warehouse);
    });

    jest.spyOn(em, 'assign').mockImplementation((obj1: Warehouse, obj2: Warehouse) => {
      const mergedObj = Object.assign({}, obj1, obj2);
      obj1.id = mergedObj.id;
      obj1.name = mergedObj.name;
      obj1.description = mergedObj.description;

      return obj1;
    });

    const updatedResult = new Warehouse('WH-updated', result.description);
    updatedResult.id = result.id;

    expect(
      await service.update(3, {
        name: updatedResult.name,
      }),
    ).toStrictEqual(updatedResult);
  });

  it('remove', async () => {
    const result = new Warehouse('WH1', 'WH1 description');
    result.id = 3;

    jest.spyOn(repository, 'findOne').mockImplementation((options: any): any => {
      expect(options.id).toBe(result.id);
      return Promise.resolve(result);
    });

    expect(await service.remove(3)).toStrictEqual('success');
  });
});
