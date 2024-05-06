import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { Inventory } from '../../database/entities/inventory.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { TenantModule } from '../tenant/tenant.module';
import { TransferModule } from '../transfer/transfer.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { TransferItemController } from './transfer-item.controller';
import { TransferItemService } from './transfer-item.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([Transfer, TransferItem, Inventory]),
        WarehouseModule,
        InventoryModule,
        TenantModule,
        forwardRef(() => TransferModule),
    ],
    controllers: [TransferItemController],
    providers: [TransferItemService],
    exports: [TransferItemService],
})
export class TransferItemModule {}
