import { Global, Module } from '@nestjs/common';
import { TransferSMService } from './transfer-sm/transfer-sm.service';

@Module({
    providers: [TransferSMService],
    exports: [TransferSMService],
})
@Global()
export class StateMachineModule {}
