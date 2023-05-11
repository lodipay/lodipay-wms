import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Destination } from '../../database/entities/destination.entity';
import { DestinationService } from './destination.service';

describe('DestinationService', () => {
  let service: DestinationService;
  let em: EntityManager;
  let repository: EntityRepository<Destination>;

  const dto = {
    name: 'Zaisan',
    description: 'Zaisan description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationService,
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
          provide: getRepositoryToken(Destination),
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<DestinationService>(DestinationService);
    em = module.get<EntityManager>(EntityManager);
    repository = module.get<EntityRepository<Destination>>(getRepositoryToken(Destination));
  });

  it('should create', async () => {
    const result = new Destination(dto.name, dto.description);

    jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Destination) => {
      result.id = obj.id = 1;

      return Promise.resolve();
    });

    expect(await service.create(dto)).toEqual({
      ...result,
      createdAt: expect.any(Date),
    });
  });

  it('should findAll', async () => {
    const result = [new Destination(`${dto.name} 1`, `${dto.description} 1`), new Destination(`${dto.name} 2`, `${dto.description} 2`)];

    jest.spyOn(repository, 'findAll').mockImplementation((): any => {
      return Promise.resolve(result);
    });

    expect(await service.findAll()).toStrictEqual(result);
  });

  it('should findOne', async () => {
    const result = new Destination(dto.name, dto.description);
    result.id = 1;

    jest.spyOn(repository, 'findOne').mockImplementation((options: any): any => {
      return Promise.resolve(result);
    });

    expect(await service.findOne(1)).toEqual({
      ...result,
      createdAt: expect.any(Date),
    });
  });

  it('should update', async () => {
    const result = {
      id: 1,
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => {
      const destination = new Destination(dto.name, dto.description);
      destination.id = result.id;

      return Promise.resolve(destination);
    });

    jest.spyOn(em, 'assign').mockImplementation((obj1: Destination, obj2: Destination) => {
      const mergedObj = { ...obj1, ...obj2 };
      obj1.id = mergedObj.id;
      obj1.name = mergedObj.name;
      obj1.description = mergedObj.description;

      return obj1;
    });

    const updatedResult = new Destination(dto.name, dto.description);
    updatedResult.id = 1;

    expect(
      await service.update(1, {
        name: dto.name,
        description: dto.description,
      }),
    ).toStrictEqual(updatedResult);
  });

  it('should remove', async () => {
    const result = new Destination(dto.name, dto.description);
    result.id = 1;

    jest.spyOn(repository, 'findOne').mockImplementation((options: any): any => {
      expect(options.id).toBe(result.id);
      return Promise.resolve(result);
    });

    expect(await service.remove(1)).toStrictEqual('deleted');
  });
});
