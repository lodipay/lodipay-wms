import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Lock } from '../../database/entities/lock.entity';
import { LockController } from './lock.controller';
import { LockService } from './lock.service';

@Module({
    imports: [MikroOrmModule.forFeature([Lock])],
    controllers: [LockController],
    providers: [LockService],
})
export class LockModule {}
