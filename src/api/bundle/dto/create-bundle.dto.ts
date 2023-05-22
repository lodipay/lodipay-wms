import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateBundleDto {
  @IsNumber()
  bundleHolderId: number;

  @IsString()
  description: string;

  @IsDate()
  activeFrom?: Date;

  @IsDate()
  activeTo?: Date;
}
