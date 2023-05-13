import { OmitType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { OrderItem } from '../../../database/entities/order-item.entity';

export class CreateOrderItemDto extends OmitType(OrderItem, [
  'id',
  'createdAt',
  'updatedAt',
  'order',
  'inventory',
]) {
  @IsNumber()
  orderId: number;

  @IsNumber()
  inventoryId: number;
}
