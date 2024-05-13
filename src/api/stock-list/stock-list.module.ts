import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { StockList } from '../../database/entities/stock-list.entity';
import { StockListController } from './stock-list.controller';
import { StockListService } from './stock-list.service';

@Module({
    imports: [MikroOrmModule.forFeature([StockList])],
    controllers: [StockListController],
    providers: [StockListService],
    exports: [StockListService],
})
export class StockListModule {}
