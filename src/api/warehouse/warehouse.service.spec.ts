import { Collection, EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Destination } from '../../database/entities/destination.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { WarehouseService } from './warehouse.service';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let em: EntityManager;
  let whRepository: EntityRepository<Warehouse>;
  let destRepository: EntityRepository<Destination>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn(),
            assign: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Warehouse),
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Destination),
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
    em = module.get<EntityManager>(EntityManager);
    whRepository = module.get<EntityRepository<Warehouse>>(getRepositoryToken(Warehouse));
    destRepository = module.get<EntityRepository<Destination>>(getRepositoryToken(Destination));
  });

  it('create', async () => {
    const dto = new CreateWarehouseDto('WH1', 'WH1 description');
    dto.destinationId = 1;

    const result = new Warehouse(dto.name, dto.description);
    const destination = new Destination('Test', 'Test destination');

    jest.spyOn(destRepository, 'findOne').mockImplementation((): any => {
      destination.id = 1;
      return Promise.resolve(destination);
    });

    jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Warehouse) => {
      result.id = obj.id = 1;
      result.destination = destination;

      return Promise.resolve();
    });

    expect(await service.create(dto)).toBeInstanceOf(Warehouse);
    expect(result.id).toBe(1);
    expect(result.name).toBe(dto.name);
    expect(result.description).toBe(dto.description);
    expect(result.destination).toBe(destination);
    expect(result.locations).toBeInstanceOf(Collection);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('findAll', async () => {
    const result = [new Warehouse('WH1', 'WH1 description'), new Warehouse('WH2', 'WH2 description')];

    jest.spyOn(whRepository, 'findAll').mockImplementation((): any => {
      return Promise.resolve(result);
    });

    expect(await service.findAll()).toStrictEqual(result);
  });

  it('findOne', async () => {
    const result = new Warehouse('WH1', 'WH1 description');
    result.id = 3;

    jest.spyOn(whRepository, 'findOne').mockImplementation((options: any): any => {
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

    jest.spyOn(whRepository, 'findOne').mockImplementation((options: any): any => {
      expect(options.id).toBe(result.id);
      return Promise.resolve(result);
    });

    expect(await service.remove(3)).toStrictEqual('success');
  });
});
