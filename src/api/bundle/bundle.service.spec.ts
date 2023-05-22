import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '../../common/mock';
import { Bundle } from '../../database/entities/bundle.entity';
import { BundleService } from './bundle.service';

describe('BundleService', () => {
  let service: BundleService;
  let em: EntityManager;
  let repository: EntityRepository<Bundle>;
  const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BundleService,
        getEntityManagerMockConfig(),
        getRepositoryMockConfig(Bundle),
      ],
    }).compile();

    service = module.get<BundleService>(BundleService);
    em = module.get<EntityManager>(EntityManager);
    repository = module.get<EntityRepository<Bundle>>(
      getRepositoryToken(Bundle),
    );
  });

  it('create', async () => {
    const dto = {
      description: 'E-commerce',
      activeFrom: yesterday,
      activeTo: tomorrow,
    };

    const result = new Bundle({
      description: dto.description,
      activeFrom: dto.activeFrom,
      activeTo: dto.activeTo,
    });

    jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Bundle) => {
      result.id = obj.id = 1;

      return Promise.resolve();
    });

    expect(await service.create(dto)).toStrictEqual(result);
  });

  it('findAll', async () => {
    const result = [
      new Bundle({
        description: 'E-commerce',
        activeFrom: yesterday,
        activeTo: tomorrow,
      }),
      new Bundle({
        description: 'Deliver to warehouse 1',
        activeFrom: yesterday,
        activeTo: tomorrow,
      }),
    ];

    jest.spyOn(repository, 'findAll').mockImplementation((): any => {
      return Promise.resolve(result);
    });

    expect(await service.findAll()).toStrictEqual(result);
  });

  it('findOne', async () => {
    const result = new Bundle({
      description: 'Deliver to warehouse 2',
      activeFrom: yesterday,
      activeTo: tomorrow,
    });
    result.id = 1;

    jest
      .spyOn(repository, 'findOne')
      .mockImplementation((options: any): any => {
        expect(options.id).toBe(result.id);
        return Promise.resolve(result);
      });

    expect(await service.findOne(1)).toStrictEqual(result);
  });

  it('update', async () => {
    const result = {
      id: 1,
      description: 'Delivery to warehouse 3',
      activeFrom: yesterday,
      activeTo: tomorrow,
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => {
      const warehouse = new Bundle({
        description: result.description,
        activeFrom: result.activeFrom,
        activeTo: result.activeTo,
      });
      warehouse.id = result.id;

      return Promise.resolve(warehouse);
    });

    jest
      .spyOn(em, 'assign')
      .mockImplementation((obj1: Bundle, obj2: Bundle) => {
        const mergedObj = Object.assign({}, obj1, obj2);
        obj1.description = mergedObj.description;
        obj1.activeFrom = mergedObj.activeFrom;
        obj1.activeTo = mergedObj.activeTo;

        return obj1;
      });

    const updatedResult = new Bundle({
      description: 'Delivery to warehouse 1',
      activeFrom: result.activeFrom,
      activeTo: result.activeTo,
    });
    updatedResult.id = result.id;

    expect(
      await service.update(1, {
        description: updatedResult.description,
        activeFrom: updatedResult.activeFrom,
        activeTo: updatedResult.activeTo,
      }),
    ).toStrictEqual(updatedResult);
  });

  it('remove', async () => {
    const result = new Bundle({
      description: 'Delivery to warehouse 1',
    });
    result.id = 1;

    jest
      .spyOn(repository, 'findOne')
      .mockImplementation((options: any): any => {
        expect(options.id).toBe(result.id);
        return Promise.resolve(result);
      });

    expect(await service.remove(1)).toStrictEqual('success');
  });
});
