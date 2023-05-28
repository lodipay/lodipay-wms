import { PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TransferStatus } from '../../../common/enum/transfer-status.enum';
import { CreateTransferDto } from './create-transfer.dto';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {
    @IsEnum(TransferStatus)
    status?: TransferStatus;
}
