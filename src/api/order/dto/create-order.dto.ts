import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  name?: string;

  @IsString()
  description?: string;

  @IsString()
  createdBy?: string;

  @IsNumber()
  fromDestinationId: number;

  @IsNumber()
  toDestinationId: number;
}
