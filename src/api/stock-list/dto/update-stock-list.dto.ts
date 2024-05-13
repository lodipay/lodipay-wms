import { PartialType } from '@nestjs/swagger';
import { CreateStocckListDto } from './create-stock-list.dto';

export class UpdateStockListDto extends PartialType(CreateStocckListDto) {}
