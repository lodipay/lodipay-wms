import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { Destination } from '../../database/entities/destination.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { TransferItemModule } from '../transfer-item/transfer-item.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([Transfer, Destination, Warehouse]),
        forwardRef(() => TransferItemModule),
    ],
    controllers: [TransferController],
    providers: [TransferService],
    exports: [TransferService],
})
export class TransferModule {}
