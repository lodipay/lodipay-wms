import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '@/common/mock';
import { FilterService } from '@/common/module/filter/filter.service';
import { QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
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
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Order),
                getRepositoryMockConfig(Destination),
                getRepositoryMockConfig(Warehouse),
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

        jest.spyOn(service, 'create').mockImplementation(
            (dto: CreateOrderDto) => {
                const order = new Order(
                    dto.name,
                    dto.description,
                    dto.createdBy,
                );
                fromDestination.id = dto.fromDestinationId;
                toDestination.id = dto.toDestinationId;
                order.from = fromDestination;
                order.to = toDestination;
                order.id = 1;

                return Promise.resolve(order);
            },
        );

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

    it('should update an order', async () => {
        const result = new Order();
        jest.spyOn(service, 'update').mockImplementation(
            (id: number, dto: UpdateOrderDto) => {
                (result.name = dto.name),
                    (result.description = dto.description),
                    (result.createdBy = dto.createdBy);
                result.id = id;
                result.from = fromDestination;
                result.to = toDestination;
                result.createdAt = new Date();
                result.createdAt = new Date();
                return Promise.resolve(result);
            },
        );

        expect(
            await controller.update('1', { name: 'order10' }),
        ).toBeInstanceOf(Order);
        expect(await controller.update('1', { name: 'order10' })).toStrictEqual(
            result,
        );
    });

    it('should find order by id', async () => {
        order1.id = 1;
        jest.spyOn(service, 'findOne').mockImplementation(id => {
            expect(id).toBe(order1.id);
            return Promise.resolve(order1);
        });

        expect(await controller.findOne(`${order1.id}`)).toEqual({
            ...order1,
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
                name: 'order1',
                description: 'Lorem ipsum dolor sit amet tasty',
                from: new Destination('Tolgoit', 'Tolgoit description'),
                to: new Destination('Zaisan', 'Zaisan description'),
            },
            {
                id: 2,
                name: 'order2',
                description: 'Lorem ipsum dolor sit amet',
                from: new Destination('Tolgoit', 'Tolgoit description'),
                to: new Destination('Zaisan', 'Zaisan description'),
            },
        ].map(data => plainToClass(Order, data));

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
        jest.spyOn(service, 'remove').mockImplementation(() => {
            return Promise.resolve();
        });
        expect(await controller.remove('1')).toBe(undefined);
    });
});
