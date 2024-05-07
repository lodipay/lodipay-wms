import { PartialType } from '@nestjs/swagger';
import { CreateGoodsShapeDto } from './create-goods-shape.dto';

export class UpdateGoodsShapeDto extends PartialType(CreateGoodsShapeDto) {}
