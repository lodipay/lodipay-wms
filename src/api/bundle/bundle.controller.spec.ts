import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Bundle } from '../../database/entities/bundle.entity';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { CreateBundleDto } from './dto/create-bundle.dto';

describe('BundleController', () => {
  let controller: BundleController;
  let bundleService: BundleService;
  const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BundleController],
      providers: [
        BundleService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Bundle),
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    controller = module.get<BundleController>(BundleController);
    bundleService = module.get<BundleService>(BundleService);
  });

  it('create', async () => {
    const data = {
      description: 'E-commerce',
      activeFrom: new Date(Date.now() - 1000 * 60 * 60 * 24),
      activeTo: new Date(Date.now()),
    };
    jest
      .spyOn(bundleService, 'create')
      .mockImplementation((dto: CreateBundleDto) => {
        const bundle = new Bundle({
          description: dto.description,
          activeFrom: dto.activeFrom,
          activeTo: dto.activeTo,
        });
        bundle.id = 1;

        return Promise.resolve(bundle);
      });

    const result = await controller.create(data);
    expect(result).toBeInstanceOf(Bundle);
    expect(result).toEqual({ id: 1, ...data, createdAt: expect.any(Date) });
  });

  it('findAll', async () => {
    const result = [
      new Bundle({
        description: 'E-commerce',
        activeFrom: yesterday,
        activeTo: tomorrow,
      }),
      new Bundle({
        description: 'Vendor',
        activeFrom: yesterday,
        activeTo: tomorrow,
      }),
    ];
    jest
      .spyOn(bundleService, 'findAll')
      .mockImplementation(() => Promise.resolve(result));
    expect(await controller.findAll()).toBe(result);
  });

  it('findOne', async () => {
    const result = new Bundle({
      description: 'E-commerce',
      activeFrom: yesterday,
      activeTo: tomorrow,
    });
    jest.spyOn(bundleService, 'findOne').mockImplementation((id: number) => {
      result.id = id;
      return Promise.resolve(result);
    });
    expect(await controller.findOne('1')).toBe(result);
  });

  it('update', async () => {
    const demoBundle = new Bundle({
      description: 'E-commerce',
      activeFrom: yesterday,
      activeTo: tomorrow,
    });
    const result = demoBundle;
    result.id = 1;

    jest.spyOn(bundleService, 'update').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(
      await controller.update(
        '1',
        new Bundle({
          description: 'E-commerce',
        }),
      ),
    ).toBe(result);
  });

  it('remove', async () => {
    const result = 'deleted';
    jest.spyOn(bundleService, 'remove').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });
});
