import { PartialType } from '@nestjs/swagger';
import { CreateGoodsColorDto } from './create-goods-color.dto';

export class UpdateGoodsColorDto extends PartialType(CreateGoodsColorDto) {}
