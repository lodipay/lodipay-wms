import { GoodsColor } from '@/database/entities/goods-color.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { GoodsColorController } from './goods-color.controller';
import { GoodsColorService } from './goods-color.service';

@Module({
    imports: [MikroOrmModule.forFeature([GoodsColor])],
    controllers: [GoodsColorController],
    providers: [GoodsColorService],
    exports: [GoodsColorService],
})
export class GoodsColorModule {}
