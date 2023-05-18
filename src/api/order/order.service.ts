import { FilterDto } from '@/common/dto/filter.dto';
import { InvalidArgumentException } from '@/common/exception/invalid.argument.exception';
import { NotFoundException } from '@/common/exception/not.found.exception';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { Destination } from '../../database/entities/destination.entity';
import { Order } from '../../database/entities/order.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,

    @InjectRepository(Destination)
    private readonly destRepository: EntityRepository<Destination>,

    @InjectRepository(Warehouse)
    private readonly warehouseRepository: EntityRepository<Warehouse>,

    private readonly em: EntityManager,
    private readonly filterService: FilterService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = new Order();
    order.name = createOrderDto.name;
    order.description = createOrderDto.description;
    order.createdBy = createOrderDto.createdBy;
    order.status = OrderStatus.NEW;

    if (createOrderDto.toDestinationId === createOrderDto.fromDestinationId) {
      throw new InvalidArgumentException(
        'From and to destinations cannot be the same',
      );
    }

    const fromDestination = await this.destRepository.findOne({
      id: createOrderDto.fromDestinationId,
    });

    if (!fromDestination) {
      throw new InvalidArgumentException('Invalid from destination');
    }

    order.from = fromDestination;

    const toDestination = await this.destRepository.findOne({
      id: createOrderDto.toDestinationId,
    });

    if (!toDestination) {
      throw new InvalidArgumentException('Invalid to destination');
    }

    order.to = toDestination;

    await this.em.persistAndFlush(order);
    return order;
  }

  search(filterDto: FilterDto) {
    return this.filterService.search<Order>(Order, filterDto);
  }

  findAll() {
    return this.orderRepository.findAll();
  }

  findOne(id: number) {
    return this.orderRepository.findOne(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (
      updateOrderDto.toDestinationId &&
      updateOrderDto.toDestinationId !== order.to.id
    ) {
      if (updateOrderDto.toDestinationId === order.from.id) {
        throw new InvalidArgumentException(
          'From and to destinations cannot be the same',
        );
      }
      const toDestination = await this.destRepository.findOne({
        id: updateOrderDto.toDestinationId,
      });

      if (!toDestination) {
        throw new InvalidArgumentException('Invalid to destination');
      }

      order.to = toDestination;
    }
    if (
      updateOrderDto.fromDestinationId &&
      updateOrderDto.fromDestinationId !== order.from.id
    ) {
      if (updateOrderDto.fromDestinationId === order.to.id) {
        throw new InvalidArgumentException(
          'From and to destinations cannot be the same',
        );
      }
      const fromDestination = await this.destRepository.findOne({
        id: updateOrderDto.fromDestinationId,
      });

      if (!fromDestination) {
        throw new InvalidArgumentException('Invalid from destination');
      }
      order.from = fromDestination;
    }

    order.createdBy = updateOrderDto.createdBy || order.createdBy;
    order.name = updateOrderDto.name || order.createdBy;
    order.description = updateOrderDto.description || order.createdBy;
    order.status = updateOrderDto.status || order.status;

    this.em.persistAndFlush(order);

    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException('order not found');
    }

    return this.em.removeAndFlush(order);
  }
}
