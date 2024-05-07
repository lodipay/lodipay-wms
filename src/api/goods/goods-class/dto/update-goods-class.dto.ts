import { PartialType } from '@nestjs/swagger';
import { CreateGoodsClassDto } from './create-goods-class.dto';

export class UpdateGoodsClassDto extends PartialType(CreateGoodsClassDto) {}
