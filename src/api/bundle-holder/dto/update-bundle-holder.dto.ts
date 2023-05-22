import { PartialType } from '@nestjs/swagger';
import { CreateBundleHolderDto } from './create-bundle-holder.dto';

export class UpdateBundleHolderDto extends PartialType(CreateBundleHolderDto) {}
