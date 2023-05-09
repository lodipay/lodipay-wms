import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Lock } from '../../database/entities/lock.entity';
import { CreateLockDto } from './dto/create-lock.dto';
import { LockController } from './lock.controller';
import { LockService } from './lock.service';

describe('LockController', () => {
  let controller: LockController;
  let lockService: LockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LockController],
      providers: [
        LockService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
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

    controller = module.get<LockController>(LockController);
    lockService = module.get<LockService>(LockService);
  });

  it('create', async () => {
    const data = {
      reason: 'E-commerce',
      from: new Date(Date.now() - 1000 * 60 * 60 * 24),
      to: new Date(Date.now()),
    };
    jest.spyOn(lockService, 'create').mockImplementation((dto: CreateLockDto) => {
      const lock = new Lock(dto.reason, dto.from, dto.to);
      lock.id = 1;

      return Promise.resolve(lock);
    });

    const result = await controller.create(data);
    expect(result).toBeInstanceOf(Lock);
    expect(result).toEqual({ id: 1, ...data });
  });

  it('findAll', async () => {
    const result = [
      new Lock('E-commerce', new Date(Date.now() - 1000 * 60 * 60 * 24), new Date(Date.now())),
      new Lock('Vendor', new Date(Date.now() - 1000 * 60 * 60 * 24), new Date(Date.now())),
    ];
    jest.spyOn(lockService, 'findAll').mockImplementation(() => Promise.resolve(result));
    expect(await controller.findAll()).toBe(result);
  });

  it('findOne', async () => {
    const result = new Lock('E-commerce', new Date(Date.now() - 1000 * 60 * 60 * 24), new Date(Date.now()));
    jest.spyOn(lockService, 'findOne').mockImplementation((id: number) => {
      result.id = id;
      return Promise.resolve(result);
    });
    expect(await controller.findOne('1')).toBe(result);
  });

  it('update', async () => {
    const demoLock = new Lock('E-commerce', new Date(Date.now() - 1000 * 60 * 60 * 24), new Date(Date.now()));
    const result = demoLock;
    result.id = 1;

    jest.spyOn(lockService, 'update').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.update('1', new Lock('E-commerce'))).toBe(result);
  });

  it('remove', async () => {
    const result = 'deleted';
    jest.spyOn(lockService, 'remove').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });
});
