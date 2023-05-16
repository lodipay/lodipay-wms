import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Inventory } from '../../database/entities/inventory.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [MikroOrmModule.forFeature([Order, OrderItem, Inventory])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
