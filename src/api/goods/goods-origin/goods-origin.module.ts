import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GoodsOrigin } from '../../../database/entities/goods-origin.entity';
import { GoodsOriginController } from './goods-origin.controller';
import { GoodsOriginService } from './goods-origin.service';

@Module({
    imports: [MikroOrmModule.forFeature([GoodsOrigin])],
    controllers: [GoodsOriginController],
    providers: [GoodsOriginService],
    exports: [GoodsOriginService],
})
export class GoodsOriginModule {}
