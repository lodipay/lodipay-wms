import { PartialType } from '@nestjs/swagger';
import { CreateGoodsSpecsDto } from './create-goods-specs.dto';

export class UpdateGoodsSpecsDto extends PartialType(CreateGoodsSpecsDto) {}
