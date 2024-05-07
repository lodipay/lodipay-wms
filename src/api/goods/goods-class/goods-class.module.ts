import { GoodsClass } from '@/database/entities/goods-class.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GoodsClassController } from './goods-class.controller';
import { GoodsClassService } from './goods-class.service';

@Module({
    imports: [MikroOrmModule.forFeature([GoodsClass])],
    controllers: [GoodsClassController],
    providers: [GoodsClassService],
    exports: [GoodsClassService],
})
export class GoodsClassModule {}
