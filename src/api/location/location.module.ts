import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Location } from '../../database/entities/location.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [MikroOrmModule.forFeature([Location, Warehouse])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
