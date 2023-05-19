import { IsDate, IsString } from 'class-validator';

export class CreateLockDto {
  @IsString()
  reason: string;

  @IsDate()
  activeFrom?: Date;

  @IsDate()
  activeTo?: Date;
}
