import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { Inventory } from '../../database/entities/inventory.entity';
import { GoodsBrand } from '../../../database/entities/goods-brand.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { TransferModule } from '../transfer/transfer.module';
import { TransferItemController } from './transfer-item.controller';
import { TransferItemService } from './goods-brand.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([ GoodsBrand,]),
        forwardRef(() => TransferModule),
    ],
    controllers: [TransferItemController],
    providers: [TransferItemService],
    exports: [TransferItemService],
})
export class TransferItemModule {}
