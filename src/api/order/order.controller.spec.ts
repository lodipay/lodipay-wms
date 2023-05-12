import { EntityManager } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Destination } from '../../database/entities/destination.entity';
import { Order } from '../../database/entities/order.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const fromDestination = new Destination('Tolgoit', 'Tolgoit description');
  fromDestination.id = 1;
  const toDestination = new Destination('Zaisan', 'Zaisan description');
  toDestination.id = 2;

  const order1 = new Order('order1', 'order1 description', 'user1');
  order1.from = fromDestination;
  order1.to = toDestination;
  const order2 = new Order('order2', 'order2 description', 'user2');
  order2.from = fromDestination;
  order2.to = toDestination;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            flush: jest.fn(),
            persistAndFlush: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Order),
          useFactory: jest.fn(() => ({
            findAll: jest.fn(),
            findOne: jest.fn(),
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
            findAll: jest.fn(),
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('shoud create new order', async () => {
    const newOrderDto = {
      name: 'order1',
      description: 'order1 description',
      createdBy: 'user1',
      fromDestinationId: 1,
      toDestinationId: 2,
    };

    jest.spyOn(service, 'create').mockImplementation((dto: CreateOrderDto) => {
      const order = new Order(dto.name, dto.description, dto.createdBy);
      fromDestination.id = dto.fromDestinationId;
      toDestination.id = dto.toDestinationId;
      order.from = fromDestination;
      order.to = toDestination;
      order.id = 1;

      return Promise.resolve(order);
    });

    const result = await controller.create(newOrderDto);
    expect(result).toBeInstanceOf(Order);
    expect(result.id).toBe(1);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.name).toBe(newOrderDto.name);
    expect(result.description).toBe(newOrderDto.description);
    expect(result.createdBy).toBe(newOrderDto.createdBy);
    expect(result.from).toBeInstanceOf(Destination);
    expect(result.from).toStrictEqual(fromDestination);
    expect(result.to).toBeInstanceOf(Destination);
    expect(result.to).toStrictEqual(toDestination);
  });

  it('should find all orders', async () => {
    const result = [order1, order2];

    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(result));

    expect(await controller.findAll()).toBe(result);
  });

  it('should update an order', async () => {
    const result = new Order();
    jest
      .spyOn(service, 'update')
      .mockImplementation((id: number, dto: UpdateOrderDto) => {
        (result.name = dto.name),
          (result.description = dto.description),
          (result.createdBy = dto.createdBy);
        result.id = id;
        result.from = fromDestination;
        result.to = toDestination;
        result.createdAt = new Date();
        result.createdAt = new Date();
        return Promise.resolve(result);
      });

    expect(await controller.update('1', { name: 'order10' })).toBeInstanceOf(
      Order,
    );
    expect(await controller.update('1', { name: 'order10' })).toStrictEqual(
      result,
    );
  });
});
