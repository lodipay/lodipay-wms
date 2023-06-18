import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { TenantModule } from '../tenant/tenant.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { TenantItemController } from './tenant-item.controller';
import { TenantItemService } from './tenant-item.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([TenantItem]),
        TenantModule,
        InventoryModule,
        WarehouseModule,
    ],
    controllers: [TenantItemController],
    providers: [TenantItemService],
})
export class TenantItemModule {}
