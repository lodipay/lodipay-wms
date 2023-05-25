import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Destination } from '../../database/entities/destination.entity';
import { Order } from '../../database/entities/order.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [MikroOrmModule.forFeature([Order, Destination, Warehouse])],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
