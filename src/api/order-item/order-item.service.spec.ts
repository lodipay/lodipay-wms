import { FilterService } from '@/common/module/filter/filter.service';
import {
  Collection,
  EntityManager,
  EntityRepository,
  QueryOrder,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { Inventory } from '../../database/entities/inventory.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Order } from '../../database/entities/order.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let orderRepo: EntityRepository<Order>;
  let orderItemRepo: EntityRepository<OrderItem>;
  let inventoryRepo: EntityRepository<Inventory>;
  let em: EntityManager;
  let filterService: FilterService;
  let createDto: CreateOrderItemDto;
  let order: Order;
  let order2: Order;
  let orderItem: OrderItem;
  let inventory: Inventory;
  let inventory2: Inventory;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule([
      OrderItemService,
      FilterService,
      getEntityManagerMockConfig(),
      getRepositoryMockConfig(Order),
      getRepositoryMockConfig(OrderItem),
      getRepositoryMockConfig(Inventory),
    ]);

    service = module.get<OrderItemService>(OrderItemService);
    em = module.get<EntityManager>(EntityManager);
    orderRepo = module.get<EntityRepository<Order>>(getRepositoryToken(Order));
    orderItemRepo = module.get<EntityRepository<OrderItem>>(
      getRepositoryToken(OrderItem),
    );
    inventoryRepo = module.get<EntityRepository<Inventory>>(
      getRepositoryToken(Inventory),
    );
    filterService = module.get<FilterService>(FilterService);

    createDto = {
      orderId: 3,
      inventoryId: 5,
      description: 'Lorem ipsum',
      inventoryAmount: 100,
    };

    order = plainToClass(Order, {
      id: 3,
      name: 'Order 1',
      description: 'Order 1 description',
      createdBy: 'Admin 1',
    });

    order2 = plainToClass(Order, {
      id: 15,
      name: 'Order 2',
      description: 'Order 2 description',
      createdBy: 'Admin 2',
    });

    inventory = plainToClass(Inventory, {
      id: 5,
      sku: 'SKU123123',
      name: 'Female Shirt',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      quantity: 10,
      expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
      batchCode: 'BATCH123',
      weight: 10,
    });

    inventory2 = plainToClass(Inventory, {
      id: 15,
      sku: '2SKU123123',
      name: 'Male Shirt',
      description:
        '2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      quantity: 100,
      expiryDate: DateTime.now().plus({ year: 2 }).toISO(),
      batchCode: '2BATCH123',
      weight: 100,
    });

    orderItem = new OrderItem();
    orderItem.description = createDto.description;
    orderItem.inventoryAmount = createDto.inventoryAmount;
    orderItem.inventories.add(inventory);
    orderItem.order = order;
  });

  describe('orderItem create', () => {
    it('should create a new order item', async () => {
      jest.spyOn(orderRepo, 'findOne').mockImplementation((id: number): any => {
        expect(id).toBe(order.id);
        return Promise.resolve(order);
      });

      jest
        .spyOn(inventoryRepo, 'findOne')
        .mockImplementation((id: number): any => {
          expect(id).toBe(inventory.id);
          return Promise.resolve(inventory);
        });

      jest.spyOn(order.orderItems, 'add').mockImplementation((): any => {
        return Promise.resolve();
      });

      const createdDate = new Date();
      jest.spyOn(em, 'persistAndFlush').mockImplementation((entities): any => {
        entities[0].id = order.id;
        entities[1].id = orderItem.id = 5;
        entities[1].order = order;
        entities[1].inventory = inventory;
        entities[1].createdAt = createdDate;
        entities[1].description = createDto.description;
        entities[1].inventoryAmount = createDto.inventoryAmount;
        return Promise.resolve();
      });

      expect(await service.create(createDto)).toBeInstanceOf(OrderItem);
      const responseData = await service.create(createDto);
      expect(responseData.createdAt).toEqual(expect.any(Date));
      expect(responseData.inventories).toBeInstanceOf(Collection);
      expect(responseData.inventoryAmount).toBe(createDto.inventoryAmount);
      expect(responseData.description).toBe(createDto.description);
    });

    it('should throw an error if order not found', async () => {
      const exception = expect(
        service.create({ ...createDto, orderId: 4 }),
      ).rejects;
      exception.toThrow(InvalidArgumentException);
      exception.toThrowError('Order not found');
    });

    it('should throw an error if inventory not found', async () => {
      jest.spyOn(orderRepo, 'findOne').mockImplementation((id: number): any => {
        expect(id).toBe(order.id);
        return Promise.resolve(order);
      });

      const exception = expect(
        service.create({ ...createDto, inventoryId: 6 }),
      ).rejects;
      exception.toThrow(InvalidArgumentException);
      exception.toThrowError('Inventory not found');
    });
  });

  describe('orderItem update', () => {
    it('should update an order item without updating order or inventory', async () => {
      const orderId = 3;
      orderItem.id = orderId;

      jest
        .spyOn(orderItemRepo, 'findOne')
        .mockImplementation((id: number): any => {
          expect(id).toBe(orderItem.id);
          return Promise.resolve(orderItem);
        });

      const updateDto = {
        description: 'UPDATED Lorem ipsum',
        inventoryAmount: 200,
      };

      jest.spyOn(orderItemRepo, 'upsert').mockImplementation((entity): any => {
        expect(entity.id).toBe(orderItem.id);
        entity.description = updateDto.description;
        entity.inventoryAmount = updateDto.inventoryAmount;
        entity.updatedAt = new Date();
        return Promise.resolve(orderItem);
      });

      expect(await service.update(orderItem.id, updateDto)).toEqual(orderItem);
    });

    it('should update an order item with updating order or inventory', async () => {
      jest
        .spyOn(orderItemRepo, 'findOne')
        .mockImplementation((id: number): any => {
          expect(id).toBe(orderItem.id);
          return Promise.resolve(orderItem);
        });

      jest.spyOn(orderRepo, 'findOne').mockImplementation((id: number): any => {
        expect(id).toBe(order2.id);
        return Promise.resolve(order);
      });

      jest
        .spyOn(inventoryRepo, 'findOne')
        .mockImplementation((id: number): any => {
          expect(id).toBe(inventory2.id);
          return Promise.resolve(inventory);
        });

      const updateDto = {
        description: 'UPDATED Lorem ipsum',
        inventoryAmount: 200,
        orderId: order2.id,
        inventoryId: inventory2.id,
      };

      jest
        .spyOn(orderItemRepo, 'upsert')
        .mockImplementation((entity: OrderItem): any => {
          expect(entity.id).toBe(orderItem.id);
          entity.description = updateDto.description;
          entity.inventoryAmount = updateDto.inventoryAmount;
          entity.inventories.add(inventory2);
          entity.order = order2;
          entity.updatedAt = new Date();
          return Promise.resolve(orderItem);
        });

      expect(await service.update(orderItem.id, updateDto)).toEqual(orderItem);
    });

    it('should throw an error if order item not found', async () => {
      const exception = await expect(service.update(100, createDto)).rejects;
      exception.toThrow(InvalidArgumentException);
      exception.toThrowError('OrderItem not found');
    });
  });

  it('should search', async () => {
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

    const orderItem2 = new OrderItem();
    orderItem2.description = 'Lorem ipsum';
    orderItem2.inventoryAmount = 100;
    orderItem2.inventories.add(inventory);
    orderItem2.order = order;

    const result = [orderItem, orderItem2];
    jest.spyOn(filterService, 'search').mockImplementation((_, filterDto) => {
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

    expect(await service.search(query)).toStrictEqual(paginatedDto);
  });

  describe('orderItem remove', () => {
    it('should remove an order item', async () => {
      orderItem.id = 1;
      jest.spyOn(orderItemRepo, 'findOne').mockImplementation((id): any => {
        expect(id).toBe(orderItem.id);
        return Promise.resolve(orderItem);
      });

      jest.spyOn(em, 'removeAndFlush').mockImplementationOnce((entity: any) => {
        expect(entity).toStrictEqual(orderItem);

        return Promise.resolve();
      });

      expect(await service.remove(orderItem.id)).toStrictEqual('deleted');
    });

    it('should throw error when the order item is not found', async () => {
      orderItem.id = 1;
      jest.spyOn(orderItemRepo, 'findOne').mockImplementation((id): any => {
        expect(id).toBe(orderItem.id);
        return Promise.resolve(null);
      });

      await expect(service.remove(orderItem.id)).rejects.toThrow(
        InvalidArgumentException,
      );
    });
  });
});
