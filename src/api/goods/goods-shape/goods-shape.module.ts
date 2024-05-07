import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GoodsShape } from '../../../database/entities/goods-shape.entity';

import { GoodsBrandController } from './goods-shape.controller';
import { GoodsShapeService } from './goods-shape.service';

@Module({
    imports: [MikroOrmModule.forFeature([GoodsShape])],
    controllers: [GoodsBrandController],
    providers: [GoodsShapeService],
    exports: [GoodsShapeService],
})
export class GoodsShapeModule {}
