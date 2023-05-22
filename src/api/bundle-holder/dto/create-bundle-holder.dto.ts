import { IsString } from 'class-validator';

export class CreateBundleHolderDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
