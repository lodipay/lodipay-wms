import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { faker } from '@mikro-orm/seeder';
import { Test, TestingModule } from '@nestjs/testing';
import { Destination } from '../../database/entities/destination.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

describe('DestinationController', () => {
  let controller: DestinationController;
  let service: DestinationService;
  let createDto: CreateDestinationDto;
  let warehouse: Warehouse;
  let whRepo: EntityRepository<Warehouse>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinationController],
      providers: [
        DestinationService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Destination),
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Warehouse),
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    controller = module.get<DestinationController>(DestinationController);
    service = module.get<DestinationService>(DestinationService);
    whRepo = module.get<EntityRepository<Warehouse>>(
      getRepositoryToken(Warehouse),
    );
    createDto = new CreateDestinationDto(
      faker.address.street(),
      faker.address.streetAddress(),
      1,
    );
    warehouse = new Warehouse(
      faker.company.name(),
      faker.company.catchPhrase(),
    );
    warehouse.id = createDto.warehouseId;
  });

  it('should create without warehouse', async () => {
    jest
      .spyOn(service, 'create')
      .mockImplementation((dto: CreateDestinationDto) => {
        const destination = new Destination(dto.name, dto.description);
        destination.id = 1;

        return Promise.resolve(destination);
      });

    const result = await controller.create({
      name: createDto.name,
      description: createDto.description,
    });
    expect(result).toBeInstanceOf(Destination);
    expect(result).toEqual({
      id: 1,
      name: createDto.name,
      description: createDto.description,
      createdAt: expect.any(Date),
    });
  });

  it('should create with warehouse', async () => {
    const whId = 1;
    warehouse.id = whId;
    jest
      .spyOn(service, 'create')
      .mockImplementation((dto: CreateDestinationDto) => {
        const destination = new Destination(dto.name, dto.description);
        destination.id = 1;

        destination.warehouse = warehouse;
        return Promise.resolve(destination);
      });

    const result = await controller.create(createDto);
    expect(result).toBeInstanceOf(Destination);
    expect(result).toEqual({
      id: 1,
      name: createDto.name,
      description: createDto.description,
      warehouse: warehouse,
      createdAt: expect.any(Date),
    });
  });

  it('should findAll', async () => {
    const result = [];
    const loopTimes = 5;
    for (let i = 0; i < loopTimes; i++) {
      const destination = new Destination(
        faker.address.street(),
        faker.address.streetAddress(),
      );
      destination.id = i + 1;
      if (i % 2 === 0) {
        const warehouse = new Warehouse(
          faker.company.name(),
          faker.company.catchPhrase(),
        );
        warehouse.id = i + 1;
        destination.warehouse = warehouse;
      }
      result.push(destination);
    }

    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(result));
    expect(await controller.findAll()).toHaveLength(loopTimes);
    expect(await controller.findAll()).toEqual(result);
  });

  it('should findOne', async () => {
    const result = new Destination('Zaisan', 'Zaisan description');
    jest.spyOn(service, 'findOne').mockImplementation((id: number) => {
      result.id = id;
      return Promise.resolve(result);
    });
    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update destination without warehouse', async () => {
    const destination = new Destination(
      faker.address.street(),
      faker.address.streetAddress(),
    );
    destination.id = 1;
    destination.createdAt = new Date();

    jest
      .spyOn(service, 'update')
      .mockImplementation((_: number, dto: UpdateDestinationDto) => {
        destination.name = dto.name;
        destination.description = dto.description;

        return Promise.resolve(destination);
      });
    expect(
      await controller.update('1', {
        name: createDto.name,
        description: createDto.description,
      }),
    ).toBe(destination);
  });

  it('should update destination with warehouse', async () => {
    const destination = new Destination(
      faker.address.street(),
      faker.address.streetAddress(),
    );
    destination.id = 1;
    destination.createdAt = new Date();

    const whId = 1;
    warehouse.id = whId;

    jest.spyOn(whRepo, 'findOne').mockImplementation((): any => {
      return Promise.resolve(warehouse);
    });

    jest
      .spyOn(service, 'update')
      .mockImplementation((_: number, dto: UpdateDestinationDto) => {
        destination.name = dto.name;
        destination.description = dto.description;
        destination.warehouse = warehouse;
        destination.updatedAt = new Date();

        return Promise.resolve(destination);
      });
    expect(
      await controller.update('1', {
        name: createDto.name,
        description: createDto.description,
        warehouseId: whId,
      }),
    ).toEqual(destination);
  });

  it('should remove', async () => {
    const result = 'deleted';
    jest.spyOn(service, 'remove').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });
});
