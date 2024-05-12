import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { OutboundController } from './outbound.controller';
import { OutboundService } from './outbound.service';
import { Goods } from '@/database/entities/goods.entity';
import { Dndetail } from '@/database/entities/dn-detail.entity';
import { Dnlist } from '@/database/entities/dn-list';

@Module({
    imports: [MikroOrmModule.forFeature([Dndetail, Goods, Dnlist]),
    ],
    controllers: [OutboundController],
    providers: [OutboundService],
    exports: [OutboundService],
})
export class OutboundModule {}
