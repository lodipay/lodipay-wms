import { QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '../../common/mock';
import { FilterService } from '../../common/service/filter.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        InventoryService,
        FilterService,
        getRepositoryMockConfig(Inventory),
        getEntityManagerMockConfig(),
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  it('create', async () => {
    const data = {
      sku: 'SKU123123',
      name: 'Female Shirt',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      quantity: 10,
      expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
      batchCode: 'BATCH123',
      weight: 10,
    };

    jest.spyOn(service, 'create').mockImplementation(() => {
      return Promise.resolve(plainToClass(Inventory, { ...data, id: 2 }));
    });

    expect(
      await controller.create(plainToClass(CreateInventoryDto, data)),
    ).toEqual(plainToClass(Inventory, { ...data, id: 2 }));
  });

  it('findOne', async () => {
    const data = {
      id: 3,
      sku: 'SKU123123',
      name: 'Female Shirt',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      quantity: 10,
      expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
      batchCode: 'BATCH123',
      weight: 10,
    };

    jest.spyOn(service, 'findOne').mockImplementation(id => {
      expect(id).toBe(data.id);
      return Promise.resolve(plainToClass(Inventory, data));
    });

    expect(await controller.findOne(data.id.toString())).toEqual(
      plainToClass(Inventory, data),
    );
  });

  it('remove', async () => {
    const result = 'deleted';
    jest.spyOn(service, 'remove').mockImplementation(id => {
      expect(id).toBe(1);
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });

  it('update', async () => {
    const data = {
      id: 3,
      sku: 'SKU123123',
      name: 'Female Shirt',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      quantity: 10,
      expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
      batchCode: 'BATCH123',
      weight: 10,
    };

    jest
      .spyOn(service, 'update')
      .mockImplementation((id, dto: UpdateInventoryDto) => {
        expect(id).toBe(data.id);
        expect(dto.sku).toBe('SKU-UPDATED');

        return Promise.resolve(
          plainToClass(Inventory, {
            ...data,
            ...dto,
          }),
        );
      });

    expect(
      await controller.update(data.id.toString(), {
        sku: 'SKU-UPDATED',
      }),
    ).toStrictEqual(
      plainToClass(Inventory, {
        ...data,
        sku: 'SKU-UPDATED',
      }),
    );
  });

  it('search', async () => {
    const query = {
      page: 2,
      limit: 10,
      query: {
        filter: {
          name: {
            $ilike: '%tasty%',
          },
        },
        order: {
          name: QueryOrder.DESC,
        },
      },
    };

    const result = [
      {
        id: 3,
        sku: 'SKU123123',
        name: 'Female Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        quantity: 10,
        expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
        batchCode: 'BATCH123',
        weight: 10,
      },
      {
        id: 4,
        sku: 'SKU123124',
        name: 'Female Shirt2',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        quantity: 10,
        expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
        batchCode: 'BATCH123',
        weight: 10,
      },
    ].map(data => plainToClass(Inventory, data));

    jest.spyOn(service, 'search').mockImplementation(filterDto => {
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
});
