import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Goods } from '../../../database/entities/goods.entity';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({
    imports: [MikroOrmModule.forFeature([Goods])],
    controllers: [GoodsController],
    providers: [GoodsService],
    exports: [GoodsService],
})
export class GoodsModule {}
