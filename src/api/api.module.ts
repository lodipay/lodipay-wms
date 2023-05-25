import { Module } from '@nestjs/common';
import { BundleHolderModule } from './bundle-holder/bundle-holder.module';
import { BundleModule } from './bundle/bundle.module';
import { DestinationModule } from './destination/destination.module';
import { InventoryModule } from './inventory/inventory.module';
import { LocationModule } from './location/location.module';
import { OrderItemModule } from './order-item/order-item.module';
import { OrderModule } from './order/order.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
    imports: [
        WarehouseModule,
        LocationModule,
        BundleModule,
        OrderModule,
        DestinationModule,
        InventoryModule,
        OrderItemModule,
        BundleHolderModule,
    ],
})
export class ApiModule {}
