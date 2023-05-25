import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { Inventory } from '../../database/entities/inventory.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Order } from '../../database/entities/order.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: EntityRepository<Order>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepo: EntityRepository<OrderItem>,

        @InjectRepository(Inventory)
        private readonly inventoryRepo: EntityRepository<Inventory>,

        private readonly em: EntityManager,
        private readonly filterService: FilterService,
    ) {}

    async create(createOrderDto: CreateOrderItemDto) {
        const order = await this.orderRepo.findOne(createOrderDto.orderId);

        if (!order) {
            throw new InvalidArgumentException('Order not found');
        }

        const inventory = await this.inventoryRepo.findOne(
            createOrderDto.inventoryId,
        );

        if (!inventory) {
            throw new InvalidArgumentException('Inventory not found');
        }

        const orderItem = new OrderItem();
        orderItem.inventoryAmount = createOrderDto.inventoryAmount;
        orderItem.inventories.add(inventory);
        orderItem.description = createOrderDto.description;
        order.orderItems.add(orderItem);

        await this.em.persistAndFlush([order, orderItem]);

        return orderItem;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<OrderItem>(OrderItem, filterDto);
    }

    async findOne(id: number) {
        const orderItem = await this.orderItemRepo.findOne(id);
        if (!orderItem) {
            throw new InvalidArgumentException('OrderItem not found');
        }
        return orderItem;
    }

    async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
        const orderItem = await this.findOne(id);

        let inventory;
        if (updateOrderItemDto.inventoryId) {
            inventory = await this.inventoryRepo.findOne(
                updateOrderItemDto.inventoryId,
            );

            if (!inventory) {
                throw new InvalidArgumentException('Inventory not found');
            }
        }

        if (inventory && !orderItem.inventories.contains(inventory)) {
            orderItem.inventories.add(inventory);
        }

        if (
            updateOrderItemDto.orderId &&
            updateOrderItemDto.orderId !== orderItem.order.id
        ) {
            const order = await this.orderRepo.findOne(
                updateOrderItemDto.orderId,
            );

            if (!order) {
                throw new InvalidArgumentException('Order not found');
            }

            orderItem.order = order;
        }

        orderItem.description = orderItem.description;
        orderItem.inventoryAmount =
            updateOrderItemDto.inventoryAmount || orderItem.inventoryAmount;

        return this.orderItemRepo.upsert(orderItem);
    }

    async remove(id: number) {
        const orderItem = await this.findOne(id);

        await this.em.removeAndFlush(orderItem);

        return 'deleted';
    }
}
