import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Lock } from '../../database/entities/lock.entity';
import { LockService } from './lock.service';

describe('LockService', () => {
  let service: LockService;
  let em: EntityManager;
  let repository: EntityRepository<Lock>;
  const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LockService,
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
          provide: getRepositoryToken(Lock),
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<LockService>(LockService);
    em = module.get<EntityManager>(EntityManager);
    repository = module.get<EntityRepository<Lock>>(getRepositoryToken(Lock));
  });

  it('create', async () => {
    const dto = {
      reason: 'E-commerce',
      from: yesterday,
      to: tomorrow,
    };

    const result = new Lock(dto.reason, dto.from, dto.to);

    jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Lock) => {
      result.id = obj.id = 1;

      return Promise.resolve();
    });

    expect(await service.create(dto)).toStrictEqual(result);
  });

  it('findAll', async () => {
    const result = [new Lock('E-commerce', yesterday, tomorrow), new Lock('Deliver to warehouse 1', yesterday, tomorrow)];

    jest.spyOn(repository, 'findAll').mockImplementation((): any => {
      return Promise.resolve(result);
    });

    expect(await service.findAll()).toStrictEqual(result);
  });

  it('findOne', async () => {
    const result = new Lock('Deliver to warehouse 2', yesterday, tomorrow);
    result.id = 1;

    jest.spyOn(repository, 'findOne').mockImplementation((options: any): any => {
      expect(options.id).toBe(result.id);
      return Promise.resolve(result);
    });

    expect(await service.findOne(1)).toStrictEqual(result);
  });

  it('update', async () => {
    const result = {
      id: 1,
      reason: 'Delivery to warehouse 3',
      from: yesterday,
      to: tomorrow,
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => {
      const warehouse = new Lock(result.reason, result.from, result.to);
      warehouse.id = result.id;

      return Promise.resolve(warehouse);
    });

    jest.spyOn(em, 'assign').mockImplementation((obj1: Lock, obj2: Lock) => {
      const mergedObj = Object.assign({}, obj1, obj2);
      obj1.reason = mergedObj.reason;
      obj1.from = mergedObj.from;
      obj1.to = mergedObj.to;

      return obj1;
    });

    const updatedResult = new Lock('Delivery to warehouse 1', result.from, result.to);
    updatedResult.id = result.id;

    expect(
      await service.update(1, {
        reason: updatedResult.reason,
        from: updatedResult.from,
        to: updatedResult.to,
      }),
    ).toStrictEqual(updatedResult);
  });

  it('remove', async () => {
    const result = new Lock('Delivery to warehouse 1');
    result.id = 1;

    jest.spyOn(repository, 'findOne').mockImplementation((options: any): any => {
      expect(options.id).toBe(result.id);
      return Promise.resolve(result);
    });

    expect(await service.remove(1)).toStrictEqual('success');
  });
});
