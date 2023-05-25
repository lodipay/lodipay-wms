import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BundleHolder } from '../../database/entities/bundle-holder.entity';
import { BundleHolderController } from './bundle-holder.controller';
import { BundleHolderService } from './bundle-holder.service';

@Module({
    imports: [MikroOrmModule.forFeature([BundleHolder])],
    controllers: [BundleHolderController],
    providers: [BundleHolderService],
    exports: [BundleHolderService],
})
export class BundleHolderModule {}
