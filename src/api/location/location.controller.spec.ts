import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Location } from '../../database/entities/location.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location.name),
          useValue: jest.fn(),
        },
        {
          provide: getRepositoryToken(Warehouse.name),
          useValue: jest.fn(),
        },
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
          })),
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  it('it should create new location', async () => {
    const warehouse = new Warehouse('WH1', 'WH1 description');
    warehouse.id = 1;
    const locationData = {
      code: 'abc',
      description: 'abc description',
      warehouseId: 1,
    };
    jest.spyOn(service, 'create').mockImplementation((dto: CreateLocationDto) => {
      const location = new Location(dto.code, warehouse, dto.description);
      location.id = 1;
      location.warehouse = warehouse;
      return Promise.resolve(location);
    });

    const result = await controller.create(locationData);
    expect(result).toBeInstanceOf(Location);
    expect(result).toEqual({
      id: 1,
      code: locationData.code,
      description: locationData.description,
      warehouse: warehouse,
    });
  });

  it('should find all locations', async () => {
    const result = [
      new Location('location 1', new Warehouse('WH1', 'WH1 description'), 'location 1 description'),
      new Location('location 2', new Warehouse('WH2', 'WH2 description'), 'location 2 description'),
    ];
    jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(result));
    expect(await controller.findAll()).toBe(result);
  });

  it('should find one location', async () => {
    const result = new Location(
      'location 1',
      new Warehouse('WH1', 'WH1 description'),
      'location 1 description',
    );
    jest.spyOn(service, 'findOne').mockImplementation((id: number) => {
      result.id = id;
      return Promise.resolve(result);
    });
    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update location', async () => {
    const locationData = new Location(
      'location 1',
      new Warehouse('WH1', 'WH1 description'),
      'location 1 description',
    );
    locationData.id = 1;

    jest.spyOn(service, 'update').mockImplementation(() => {
      return Promise.resolve(locationData);
    });
    expect(await controller.update('1', locationData)).toBe(locationData);
  });

  it('remove', async () => {
    const result = 'deleted';
    jest.spyOn(service, 'remove').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });
});
