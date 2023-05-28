import { Module } from '@nestjs/common';
import { BundleHolderModule } from './bundle-holder/bundle-holder.module';
import { BundleModule } from './bundle/bundle.module';
import { DestinationModule } from './destination/destination.module';
import { InventoryModule } from './inventory/inventory.module';
import { LocationModule } from './location/location.module';
import { TransferItemModule } from './transfer-item/transfer-item.module';
import { TransferModule } from './transfer/transfer.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
    imports: [
        WarehouseModule,
        LocationModule,
        BundleModule,
        TransferModule,
        DestinationModule,
        InventoryModule,
        TransferItemModule,
        BundleHolderModule,
    ],
})
export class ApiModule {}
