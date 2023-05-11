import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Destination } from '../../database/entities/destination.entity';
import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';

describe('DestinationController', () => {
  let controller: DestinationController;
  let service: DestinationService;

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
      ],
    }).compile();

    controller = module.get<DestinationController>(DestinationController);
    service = module.get<DestinationService>(DestinationService);
  });

  it('should create', async () => {
    const data = {
      name: 'Zaisan',
      description: 'Zaisan description',
    };
    jest.spyOn(service, 'create').mockImplementation((dto: CreateDestinationDto) => {
      const destination = new Destination(dto.name, dto.description);
      destination.id = 1;

      return Promise.resolve(destination);
    });

    const result = await controller.create(data);
    expect(result).toBeInstanceOf(Destination);
    expect(result).toEqual({ id: 1, ...data, createdAt: expect.any(Date) });
  });

  it('should findAll', async () => {
    const result = [new Destination('Zaisan', 'Zaisan description'), new Destination('Tolgoit', 'Tolgoit description')];
    jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(result));
    expect(await controller.findAll()).toBe(result);
  });

  it('should findOne', async () => {
    const result = new Destination('Zaisan', 'Zaisan description');
    jest.spyOn(service, 'findOne').mockImplementation((id: number) => {
      result.id = id;
      return Promise.resolve(result);
    });
    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update', async () => {
    const demoDesc = new Destination('Zaisan', 'Zaisan description');
    const result = demoDesc;
    result.id = 1;

    jest.spyOn(service, 'update').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.update('1', new Destination('Zaisan updated'))).toBe(result);
  });

  it('should remove', async () => {
    const result = 'deleted';
    jest.spyOn(service, 'remove').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });
});
