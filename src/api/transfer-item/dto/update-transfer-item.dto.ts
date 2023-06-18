import { PartialType } from '@nestjs/swagger';
import { CreateTransferItemDto } from './create-transfer-item.dto';

export class UpdateTransferItemDto extends PartialType(CreateTransferItemDto) {}
