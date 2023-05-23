import { Collection, QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '../../common/mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { BundleHolder } from '../../database/entities/bundle-holder.entity';
import { Bundle } from '../../database/entities/bundle.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { BundleHolderService } from '../bundle-holder/bundle-holder.service';
import { InventoryService } from '../inventory/inventory.service';
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
        FilterService,
        BundleHolderService,
        InventoryService,
        getRepositoryMockConfig(Bundle),
        getRepositoryMockConfig(BundleHolder),
        getRepositoryMockConfig(Inventory),
        getEntityManagerMockConfig(),
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
      bundleHolderId: 1,
      inventoryId: 1,
      inventoryQuantity: 50,
    };
    const bundleHolder = new BundleHolder();
    bundleHolder.name = 'E-commerce';
    bundleHolder.description = 'E-commerce description';

    const inventory = new Inventory();
    inventory.id = 1;
    inventory.sku = 'SKU';
    inventory.name = 'Inventory';
    inventory.quantity = 50;
    inventory.batchCode = 'BATCH_CODE';

    jest
      .spyOn(bundleService, 'create')
      .mockImplementation((dto: CreateBundleDto) => {
        const bundle = new Bundle();
        bundle.description = dto.description;
        bundle.activeFrom = dto.activeFrom;
        bundle.activeTo = dto.activeTo;
        bundle.bundleHolder = bundleHolder;
        bundle.id = 1;
        bundle.createdAt = new Date();

        return Promise.resolve(bundle);
      });

    delete data.bundleHolderId;
    const result = await controller.create(data);
    expect(result).toBeInstanceOf(Bundle);

    delete data.inventoryId;
    delete data.inventoryQuantity;

    expect(result).toMatchObject({
      id: 1,
      ...data,
      createdAt: expect.any(Date),
      bundleHolder: expect.any(BundleHolder),
      inventories: expect.any(Collection),
    });
  });

  it('search', async () => {
    const query = {
      page: 2,
      limit: 10,
      query: {
        filter: {
          name: {
            $ilike: '%holder%',
          },
        },
        order: {
          id: QueryOrder.ASC,
        },
      },
    };

    const result = [
      plainToClass(Bundle, { id: 1, description: 'E-commerce 1' }),
      plainToClass(Bundle, { id: 2, description: 'E-commerce 2' }),
    ];

    jest.spyOn(bundleService, 'search').mockImplementation(filterDto => {
      expect(filterDto).toStrictEqual(query);
      const paginatedDto = new PaginatedDto();
      paginatedDto.result = result;
      paginatedDto.page = filterDto.page;
      paginatedDto.limit = filterDto.limit;
      paginatedDto.total = 100;
      paginatedDto.totalPage = 10;

      return Promise.resolve(paginatedDto);
    });

    const paginatedDto = new PaginatedDto();
    paginatedDto.result = result;
    paginatedDto.page = query.page;
    paginatedDto.limit = query.limit;
    paginatedDto.total = 100;
    paginatedDto.totalPage = 10;

    expect(await controller.search(query)).toStrictEqual(paginatedDto);
  });

  it('findOne', async () => {
    const result = plainToClass(Bundle, {
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
    const demoBundle = plainToClass(Bundle, {
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
        plainToClass(Bundle, {
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
