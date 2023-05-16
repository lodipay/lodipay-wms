import { PaginatedDto } from '@/common/dto/paginated.dto';
import { InvalidArgumentException } from '@/common/exception/invalid.argument.exception';
import { NotFoundException } from '@/common/exception/not.found.exception';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '@/common/mock';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
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
  let guchinhoyr: Destination;
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

    tolgoit = plainToClass(Destination, {
      id: 1,
      name: 'Tolgoit',
      description: 'Tolgoit description',
    });

    zaisan = plainToClass(Destination, {
      id: 2,
      name: 'Zaisan',
      description: 'Zaisan description',
    });

    guchinhoyr = plainToClass(Destination, {
      id: 3,
      name: 'Guchin hoyr',
      description: 'Guchin hoyr description',
    });

    const testOrderData = {
      name: 'test ecommerce order',
      description: 'test ecommerce order description',
      fromDestinationId: zaisan.id,
      toDestinationId: tolgoit.id,
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

    destRepo = module.get<EntityRepository<Destination>>(
      getRepositoryToken(Destination),
    );
    orderRepo = module.get<EntityRepository<Order>>(getRepositoryToken(Order));
    em = module.get<EntityManager>(EntityManager);

    filterService = module.get<FilterService>(FilterService);
  });

  describe('create', () => {
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

    it('should throw error when to and from destinations are same', () => {
      const createDto = new CreateOrderDto(
        testOrderDto.name,
        testOrderDto.description,
        zaisan.id,
        zaisan.id,
        testOrderDto.description,
      );

      const exception = expect(service.create(createDto)).rejects;
      exception.toThrow(InvalidArgumentException);
      exception.toThrowError('From and to destinations cannot be the same');
    });

    it('should throw error when from destination is null', () => {
      const createDto = new CreateOrderDto(
        testOrderDto.name,
        testOrderDto.description,
        null,
        zaisan.id,
        testOrderDto.description,
      );

      const exception = expect(service.create(createDto)).rejects;
      exception.toThrow(InvalidArgumentException);
      exception.toThrowError('Invalid from destination');
    });

    it('should throw error when to destination is null', async () => {
      const createDto = new CreateOrderDto(
        testOrderDto.name,
        testOrderDto.description,
        zaisan.id,
        null,
        testOrderDto.description,
      );

      jest
        .spyOn(destRepo, 'findOne')
        .mockImplementationOnce((options: any): any => {
          expect(options.id).toBe(zaisan.id);
          return Promise.resolve(zaisan);
        });

      const exception = expect(service.create(createDto)).rejects;
      exception.toThrow(InvalidArgumentException);
      exception.toThrowError('Invalid to destination');
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

  describe('update', () => {
    it('should throw error when order not found', async () => {
      jest.spyOn(orderRepo, 'findOne').mockImplementation(id => {
        expect(id).toBe(123);
        return Promise.resolve(null);
      });

      await expect(
        service.update(123, {
          fromDestinationId: zaisan.id,
          toDestinationId: guchinhoyr.id,
        }),
      ).rejects.toThrow(NotFoundException);
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

      jest.spyOn(orderRepo, 'findOne').mockImplementation((): any => {
        return Promise.resolve(order);
      });

      jest
        .spyOn(destRepo, 'findOne')
        .mockImplementationOnce((): any => {
          return Promise.resolve(guchinhoyr);
        })
        .mockImplementationOnce((): any => {
          return Promise.resolve(zaisan);
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
          fromDestinationId: zaisan.id,
          toDestinationId: guchinhoyr.id,
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
        orderItems: expect.anything(),
      });
    });

    it('should throw error when the given toDestination is the same as the from destination', async () => {
      const order = new Order();
      order.id = 1;
      order.name = testOrder.name;
      order.description = testOrder.description;
      order.createdBy = testOrder.createdBy;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.from = zaisan;
      order.to = tolgoit;

      jest.spyOn(orderRepo, 'findOne').mockImplementation((): any => {
        return Promise.resolve(order);
      });

      const exceptionExpect = await expect(
        service.update(order.id, {
          name: order.name,
          description: order.description,
          createdBy: order.createdBy,
          toDestinationId: zaisan.id,
        }),
      ).rejects;

      exceptionExpect.toThrow(InvalidArgumentException);
      exceptionExpect.toThrowError(
        'From and to destinations cannot be the same',
      );
    });

    it('should throw error when the given toDestination is not found', async () => {
      const order = new Order();
      order.id = 1;
      order.name = testOrder.name;
      order.description = testOrder.description;
      order.createdBy = testOrder.createdBy;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.from = zaisan;
      order.to = tolgoit;

      jest.spyOn(orderRepo, 'findOne').mockImplementation((): any => {
        return Promise.resolve(order);
      });

      jest
        .spyOn(destRepo, 'findOne')
        .mockImplementationOnce((options: any): any => {
          expect(options.id).toBe(123);
          return Promise.resolve(null);
        });

      const exceptionExpect = await expect(
        service.update(order.id, {
          name: order.name,
          description: order.description,
          createdBy: order.createdBy,
          toDestinationId: 123,
        }),
      ).rejects;

      exceptionExpect.toThrow(InvalidArgumentException);
      exceptionExpect.toThrowError('Invalid to destination');
    });

    it('should throw error when the given toDestination is not found', async () => {
      const order = new Order();
      order.id = 1;
      order.name = testOrder.name;
      order.description = testOrder.description;
      order.createdBy = testOrder.createdBy;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.from = zaisan;
      order.to = tolgoit;

      jest.spyOn(orderRepo, 'findOne').mockImplementation((): any => {
        return Promise.resolve(order);
      });

      jest
        .spyOn(destRepo, 'findOne')
        .mockImplementationOnce((options: any): any => {
          expect(options.id).toBe(123);
          return Promise.resolve(null);
        });

      const exceptionExpect = await expect(
        service.update(order.id, {
          name: order.name,
          description: order.description,
          createdBy: order.createdBy,
          toDestinationId: 123,
        }),
      ).rejects;

      exceptionExpect.toThrow(InvalidArgumentException);
      exceptionExpect.toThrowError('Invalid to destination');
    });

    it('should throw error when the given fromDestination is same as the to destination', async () => {
      const order = new Order();
      order.id = 1;
      order.name = testOrder.name;
      order.description = testOrder.description;
      order.createdBy = testOrder.createdBy;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.from = zaisan;
      order.to = tolgoit;

      jest.spyOn(orderRepo, 'findOne').mockImplementation((): any => {
        return Promise.resolve(order);
      });

      jest
        .spyOn(destRepo, 'findOne')
        .mockImplementationOnce((options: any): any => {
          expect(options.id).toBe(tolgoit.id);
          return Promise.resolve(tolgoit);
        });

      const exceptionExpect = await expect(
        service.update(order.id, {
          name: order.name,
          description: order.description,
          createdBy: order.createdBy,
          fromDestinationId: tolgoit.id,
        }),
      ).rejects;

      exceptionExpect.toThrow(InvalidArgumentException);
      exceptionExpect.toThrowError(
        'From and to destinations cannot be the same',
      );
    });

    it('should throw error when the given fromDestination is not found', async () => {
      const order = new Order();
      order.id = 1;
      order.name = testOrder.name;
      order.description = testOrder.description;
      order.createdBy = testOrder.createdBy;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.from = zaisan;
      order.to = tolgoit;

      jest.spyOn(orderRepo, 'findOne').mockImplementation((): any => {
        return Promise.resolve(order);
      });

      jest
        .spyOn(destRepo, 'findOne')
        .mockImplementationOnce((options: any): any => {
          expect(options.id).toBe(123);
          return Promise.resolve(null);
        });

      const exceptionExpect = await expect(
        service.update(order.id, {
          name: order.name,
          description: order.description,
          createdBy: order.createdBy,
          fromDestinationId: 123,
        }),
      ).rejects;

      exceptionExpect.toThrow(InvalidArgumentException);
      exceptionExpect.toThrowError('Invalid from destination');
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

  describe('remove', () => {
    it('should remove an order', async () => {
      const order = new Order();
      order.id = 1;
      order.name = testOrder.name;
      order.description = testOrder.description;
      order.createdBy = testOrder.createdBy;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      order.from = zaisan;
      order.to = tolgoit;

      jest.spyOn(orderRepo, 'findOne').mockImplementation((id): any => {
        expect(id).toBe(order.id);
        return Promise.resolve(order);
      });

      jest.spyOn(em, 'removeAndFlush').mockImplementationOnce((entity: any) => {
        expect(entity).toStrictEqual(order);

        return Promise.resolve();
      });

      await service.remove(order.id);
    });

    it('should throw error when the order is not found', async () => {
      jest.spyOn(orderRepo, 'findOne').mockImplementation((id): any => {
        expect(id).toBe(123);
        return Promise.resolve(null);
      });

      await expect(service.remove(123)).rejects.toThrow(NotFoundException);
    });
  });
});
