import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { inboundController } from './inbound.controller';
import { InboundService } from './inbound.service';
import { Supplier } from '@/database/entities/supplier.entity';
import { Asndetail } from '@/database/entities/asndetail.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Asndetail, Supplier])],
    controllers: [inboundController],
    providers: [InboundService],
    exports: [InboundService],
})
export class InboundModule {}
