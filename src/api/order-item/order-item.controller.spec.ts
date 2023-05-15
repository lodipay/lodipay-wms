import { FilterService } from '@/common/module/filter/filter.service';
import { Collection, QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '../../common/mock';
import { Inventory } from '../../database/entities/inventory.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Order } from '../../database/entities/order.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let service: OrderItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        OrderItemService,
        FilterService,
        getRepositoryMockConfig(Order),
        getRepositoryMockConfig(OrderItem),
        getRepositoryMockConfig(Inventory),
        getEntityManagerMockConfig(),
      ],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
    service = module.get<OrderItemService>(OrderItemService);
  });

  it('should create new order item', async () => {
    const data = {
      orderId: 1,
      inventoryId: 3,
      inventoryAmount: 5,
      description: 'Lorem ipsum dolor sit amet',
    };

    const result = plainToClass(OrderItem, { ...data, id: 2 });
    jest.spyOn(service, 'create').mockImplementation(() => {
      result.id = 1;
      result.createdAt = new Date();
      return Promise.resolve(result);
    });

    expect(
      await controller.create(plainToClass(CreateOrderItemDto, data)),
    ).toEqual(result);
  });

  it('should find order by id', async () => {
    const data = {
      id: 5,
      orderId: 1,
      inventoryId: 3,
      inventoryAmount: 5,
      description: 'Lorem ipsum dolor sit amet',
    };

    jest.spyOn(service, 'findOne').mockImplementation(id => {
      expect(id).toBe(data.id);
      return Promise.resolve(plainToClass(OrderItem, data));
    });

    expect(await controller.findOne(`${data.id}`)).toEqual({
      ...data,
      createdAt: expect.any(Date),
      inventories: expect.any(Collection),
    });
  });

  it('should update order item', async () => {
    const data = {
      id: 1,
      description: 'Lorem ipsum dolor sit amet',
      inventoryAmount: 1000,
      inventoryId: 3,
      orderId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateValues = {
      description: 'UPDATE Lorem ipsum dolor sit amet',
    };

    jest
      .spyOn(service, 'update')
      .mockImplementation((id: number, dto: UpdateOrderItemDto) => {
        expect(id).toBe(data.id);
        expect(dto.description).toBe(updateValues.description);

        return Promise.resolve(
          plainToClass(OrderItem, {
            ...data,
            ...dto,
          }),
        );
      });

    expect(await controller.update(`${data.id}`, updateValues)).toBeInstanceOf(
      OrderItem,
    );
    expect(await controller.update(`${data.id}`, updateValues)).toEqual({
      ...plainToClass(OrderItem, {
        ...data,
        description: updateValues.description,
      }),
      createdAt: expect.any(Date),
    });
  });

  it('should search', async () => {
    const query = {
      page: 2,
      limit: 10,
      query: {
        filter: {
          description: {
            $ilike: '%tasty%',
          },
        },
        order: {
          id: QueryOrder.ASC,
        },
      },
    };

    const result = [
      {
        id: 1,
        description: 'Lorem ipsum dolor sit amet tasty',
        inventoryAmount: 1000,
        inventoryId: 8,
        orderId: 5,
      },
      {
        id: 2,
        description: 'Lorem ipsum dolor sit amet',
        inventoryAmount: 4000,
        inventoryId: 9,
        orderId: 4,
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

  it('remove', async () => {
    const result = 'deleted';
    jest.spyOn(service, 'remove').mockImplementation(() => {
      return Promise.resolve(result);
    });
    expect(await controller.remove('1')).toBe(result);
  });
});
