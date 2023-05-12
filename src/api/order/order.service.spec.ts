import { PaginatedDto } from '@/common/dto/paginated.dto';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '@/common/mock';
import { FilterService } from '@/common/service/filter.service';
import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { Destination } from '../../database/entities/destination.entity';
import { Order } from '../../database/entities/order.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let testOrder: Order;
  let tolgoit: Destination;
  let zaisan: Destination;
  let destRepo: EntityRepository<Destination>;
  let orderRepo: EntityRepository<Order>;
  let testOrderDto: CreateOrderDto;
  let em: EntityManager;
  let filterService: FilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        FilterService,
        getEntityManagerMockConfig(),
        getRepositoryMockConfig(Order),
        getRepositoryMockConfig(Destination),
        getRepositoryMockConfig(Warehouse),
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    const testOrderData = {
      name: 'test ecommerce order',
      description: 'test ecommerce order description',
      fromDestinationId: 1,
      toDestinationId: 1,
      createdBy: 'user1',
    };
    testOrder = new Order(
      testOrderData.name,
      testOrderData.description,
      testOrderData.createdBy,
    );

    testOrderDto = new CreateOrderDto(
      testOrderData.name,
      testOrderData.description,
      testOrderData.fromDestinationId,
      testOrderData.toDestinationId,
      testOrderData.createdBy,
    );

    tolgoit = new Destination('Tolgoit', 'Tolgoit description');
    zaisan = new Destination('Zaisan', 'Zaisan description');

    destRepo = module.get<EntityRepository<Destination>>(
      getRepositoryToken(Destination),
    );
    orderRepo = module.get<EntityRepository<Order>>(getRepositoryToken(Order));
    em = module.get<EntityManager>(EntityManager);

    filterService = module.get<FilterService>(FilterService);
  });

  it('should create an order', async () => {
    const createDto = new CreateOrderDto(
      testOrderDto.name,
      testOrderDto.description,
      testOrderDto.fromDestinationId,
      testOrderDto.toDestinationId,
      testOrderDto.description,
    );

    jest
      .spyOn(destRepo, 'findOne')
      .mockImplementation(() => {
        zaisan.id = 1;
        return Promise.resolve(zaisan);
      })
      .mockImplementationOnce(() => {
        tolgoit.id = 2;
        return Promise.resolve(tolgoit);
      });

    jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Order) => {
      obj.id = 1;

      return Promise.resolve();
    });

    expect(await service.create(createDto)).toBeInstanceOf(Order);
    expect(await service.create(createDto)).toMatchObject({
      id: 1,
      name: createDto.name,
      description: createDto.description,
      createdBy: createDto.createdBy,
      from: expect.any(Destination),
      to: expect.any(Destination),
      createdAt: expect.any(Date),
    });
  });

  it('should find all orders', async () => {
    const result = [];

    for (let i = 0; i < 2; i++) {
      const order = new Order();
      order.id = i;
      order.name = testOrder.name;
      order.description = testOrder.description;
      order.createdBy = testOrder.createdBy;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.from = tolgoit;
      order.to = zaisan;
      result.push(order);
    }

    jest.spyOn(orderRepo, 'findAll').mockImplementation(() => {
      return Promise.resolve(result);
    });

    expect(await service.findAll()).toStrictEqual(result);
  });

  it('should find an order', async () => {
    const order = new Order();
    order.id = 1;
    order.name = testOrder.name;
    order.description = testOrder.description;
    order.createdBy = testOrder.createdBy;
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.from = tolgoit;
    order.to = zaisan;

    jest.spyOn(orderRepo, 'findOne').mockImplementation((): any => {
      return Promise.resolve(order);
    });

    expect(await service.findOne(1)).toBe(order);
  });

  it('should update an order', async () => {
    const order = new Order();
    order.id = 1;
    order.name = testOrder.name;
    order.description = testOrder.description;
    order.createdBy = testOrder.createdBy;
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.from = tolgoit;
    order.to = zaisan;

    jest.spyOn(service, 'findOne').mockImplementation((): any => {
      return Promise.resolve(order);
    });

    const updatedResult = new Order(
      testOrderDto.name,
      testOrderDto.description,
    );
    updatedResult.id = 1;
    updatedResult.name = testOrder.name;
    updatedResult.description = testOrder.description;
    updatedResult.createdBy = testOrder.createdBy;
    updatedResult.updatedAt = new Date();
    updatedResult.createdAt = new Date();

    expect(
      await service.update(order.id, {
        name: order.name,
        description: order.description,
        createdBy: order.createdBy,
      }),
    ).toEqual({
      id: 1,
      name: order.name,
      description: order.description,
      createdBy: order.createdBy,
      from: expect.any(Destination),
      to: expect.any(Destination),
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
    });
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

    const entity = new Order('Transfer', '#123121');
    entity.from = tolgoit;
    entity.to = zaisan;

    const result = [testOrder, entity];
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
});
