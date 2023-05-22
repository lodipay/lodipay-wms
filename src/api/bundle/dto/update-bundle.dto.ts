import { OmitType } from '@nestjs/swagger';
import { CreateBundleDto } from './create-bundle.dto';

export class UpdateBundleDto extends OmitType(CreateBundleDto, []) {}
