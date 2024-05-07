import { Module } from '@nestjs/common';
import { DestinationModule } from './destination/destination.module';
import { GoodsBrandModule } from './goods/goods-brand/goods-brand.module';
import { GoodsClassModule } from './goods/goods-class/goods-class.module';
import { GoodsColorModule } from './goods/goods-color/goods-color.module';
import { GoodsOriginModule } from './goods/goods-origin/goods-origin.module';
import { GoodsShapeModule } from './goods/goods-shape/goods-shape.module';
import { GoodsSpecsModule } from './goods/goods-specs/goods-specs.module';
import { GoodsUnitModule } from './goods/goods-unit/goods-unit.module';
import { GoodsModule } from './goods/goods/goods.module';
import { InventoryLocationModule } from './inventory-location/inventory-location.module';
import { InventoryModule } from './inventory/inventory.module';
import { LocationModule } from './location/location.module';
import { TenantItemModule } from './tenant-item/tenant-item.module';
import { TenantModule } from './tenant/tenant.module';
import { TransferItemModule } from './transfer-item/transfer-item.module';
import { TransferModule } from './transfer/transfer.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { SupplierModule } from './supplier/supplier.module';

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
        SupplierModule,
        GoodsBrandModule,
        GoodsClassModule,
        GoodsColorModule,
        GoodsOriginModule,
        GoodsSpecsModule,
        GoodsShapeModule,
        GoodsUnitModule,
        GoodsModule,
    ],
})
export class ApiModule {}
