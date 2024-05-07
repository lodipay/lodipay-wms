import { PartialType } from '@nestjs/swagger';
import { CreateGoodsUnitDto } from './create-goods-unit.dto';

export class UpdateGoodsUnitDto extends PartialType(CreateGoodsUnitDto) {}
