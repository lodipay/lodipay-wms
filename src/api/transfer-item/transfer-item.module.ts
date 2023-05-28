import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Inventory } from '../../database/entities/inventory.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { TransferItemController } from './transfer-item.controller';
import { TransferItemService } from './transfer-item.service';

@Module({
    imports: [MikroOrmModule.forFeature([Transfer, TransferItem, Inventory])],
    controllers: [TransferItemController],
    providers: [TransferItemService],
})
export class TransferItemModule {}
