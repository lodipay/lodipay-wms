import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Destination } from '../../database/entities/destination.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
    imports: [MikroOrmModule.forFeature([Transfer, Destination, Warehouse])],
    controllers: [TransferController],
    providers: [TransferService],
})
export class TransferModule {}
