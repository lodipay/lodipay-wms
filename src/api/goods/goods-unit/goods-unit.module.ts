import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GoodsUnit } from '../../../database/entities/goods-unit.entity';

import { GoodsUnitController } from './goods-unit.controller';
import { GoodsUnitService } from './goods-unit.service';

@Module({
    imports: [MikroOrmModule.forFeature([GoodsUnit])],
    controllers: [GoodsUnitController],
    providers: [GoodsUnitService],
    exports: [GoodsUnitService],
})
export class GoodsUnitModule {}
