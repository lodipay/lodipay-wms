import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GoodsSpecs } from '../../../database/entities/goods-specs.entity';
import { GoodsSpecsController } from './goods-specs.controller';
import { GoodsSpecsService } from './goods-specs.service';

@Module({
    imports: [MikroOrmModule.forFeature([GoodsSpecs])],
    controllers: [GoodsSpecsController],
    providers: [GoodsSpecsService],
    exports: [GoodsSpecsService],
})
export class GoodsSpecsModule {}
