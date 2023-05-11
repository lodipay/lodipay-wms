import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
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
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = new Order();
    order.name = createOrderDto.name;
    order.description = createOrderDto.description;
    order.createdBy = createOrderDto.createdBy;
    order.from = await this.destRepository.findOne({ id: createOrderDto.fromDestinationId });
    order.to = await this.destRepository.findOne({ id: createOrderDto.toDestinationId });

    await this.em.persistAndFlush(order);
    return order;
  }

  findAll() {
    return this.orderRepository.findAll();
  }

  findOne(id: number) {
    return this.orderRepository.findOne(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne(id);
    order.to = await this.destRepository.findOne({ id: updateOrderDto.toDestinationId });
    order.from = await this.destRepository.findOne({ id: updateOrderDto.fromDestinationId });
    order.createdBy = updateOrderDto.createdBy;
    order.name = updateOrderDto.name;
    order.description = updateOrderDto.description;

    this.em.persistAndFlush(order);

    return order;
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    if (order) {
      await this.em.removeAndFlush(order);
    }

    return 'deleted';
  }

  // private checkWarehouses(dto: CreateOrderDto | UpdateOrderDto) {
  //   if (dto.fromDestinationId && !dto.toDestinationId) {
  //     throw new BadRequestException('To warehouse is required');
  //   }

  //   if (!dto.fromDestinationId && dto.toDestinationId) {
  //     throw new BadRequestException('From warehouse is required');
  //   }
  // }

  // private defineWarehouses(order: Order, dto: CreateOrderDto | UpdateOrderDto) {
  //   if (dto.fromWarehouseId && dto.toWarehouseId) {
  //     order.from = this.em.getReference(Warehouse, dto.fromWarehouseId);
  //     order.to = this.em.getReference(Warehouse, dto.toWarehouseId);
  //   }
  //   return order;
  // }
}
