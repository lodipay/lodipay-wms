import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Destination } from '../../database/entities/destination.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';

@Module({
    imports: [MikroOrmModule.forFeature([Destination, Warehouse])],
    controllers: [DestinationController],
    providers: [DestinationService],
})
export class DestinationModule {}
