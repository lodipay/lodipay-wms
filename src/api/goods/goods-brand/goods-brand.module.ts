import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { GoodsBrand } from '../../../database/entities/goods-brand.entity';
import { GoodsBrandController } from './goods-brand.controller';
import { GoodsBrandService } from './goods-brand.service';

@Module({
    imports: [MikroOrmModule.forFeature([GoodsBrand])],
    controllers: [GoodsBrandController],
    providers: [GoodsBrandService],
    exports: [GoodsBrandService],
})
export class GoodsBrandModule {}
