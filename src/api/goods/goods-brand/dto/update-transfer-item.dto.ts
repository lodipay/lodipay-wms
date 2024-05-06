import { PartialType } from '@nestjs/swagger';
import { CreateGoodsBrandDto } from './create-goods-brand.dto';

export class UpdateGoodsBrandDto extends PartialType(CreateGoodsBrandDto) {}
