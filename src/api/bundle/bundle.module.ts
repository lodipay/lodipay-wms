import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Bundle } from '../../database/entities/bundle.entity';
import { BundleHolderModule } from '../bundle-holder/bundle-holder.module';
import { InventoryModule } from '../inventory/inventory.module';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Bundle]),
    BundleHolderModule,
    InventoryModule,
  ],
  controllers: [BundleController],
  providers: [BundleService],
})
export class BundleModule {}
