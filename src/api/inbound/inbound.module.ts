import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { InboundController } from './inbound.controller';
import { InboundService } from './inbound.service';
import { Supplier } from '@/database/entities/supplier.entity';
import { Asndetail } from '@/database/entities/asn-detail.entity';
import { Goods } from '@/database/entities/goods.entity';
import { Asnlist } from '@/database/entities/asn-list.entity';
import { StockList } from '@/database/entities/stock-list.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Asndetail, Supplier, Goods, Asnlist, StockList]),
    ],
    controllers: [InboundController],
    providers: [InboundService],
    exports: [InboundService],
})
export class InboundModule {}
