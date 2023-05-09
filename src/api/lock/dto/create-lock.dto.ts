import { IsDate, IsString } from 'class-validator';

export class CreateLockDto {
  @IsString()
  reason: string;

  @IsDate()
  from?: Date;

  @IsDate()
  to?: Date;
}
