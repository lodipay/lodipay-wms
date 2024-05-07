import { PartialType } from '@nestjs/swagger';
import { CreateGoodsOriginDto } from './create-goods-origin.dto';

export class UpdateGoodsOriginDto extends PartialType(CreateGoodsOriginDto) {}
