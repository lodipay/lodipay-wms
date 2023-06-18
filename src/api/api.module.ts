import { Module } from '@nestjs/common';
import { DestinationModule } from './destination/destination.module';
import { InventoryLocationModule } from './inventory-location/inventory-location.module';
import { InventoryModule } from './inventory/inventory.module';
import { LocationModule } from './location/location.module';
import { TenantItemModule } from './tenant-item/tenant-item.module';
import { TenantModule } from './tenant/tenant.module';
import { TransferItemModule } from './transfer-item/transfer-item.module';
import { TransferModule } from './transfer/transfer.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
    imports: [
        WarehouseModule,
        LocationModule,
        TransferModule,
        DestinationModule,
        InventoryModule,
        TransferItemModule,
        TenantModule,
        TenantItemModule,
        InventoryLocationModule,
    ],
})
export class ApiModule {}
