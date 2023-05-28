import { Global, Module } from '@nestjs/common';
import { InventoryTransferService } from './inventory-transfer/inventory-transfer/inventory-transfer.service';

@Module({
    providers: [InventoryTransferService],
})
@Global()
export class StateMachineModule {}
