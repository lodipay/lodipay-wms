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

  constructor(name: string, description: string, fromDestinationId?: number, toDestinationId?: number, createdBy?: string) {
    this.name = name;
    this.description = description;
    this.fromDestinationId = fromDestinationId;
    this.toDestinationId = toDestinationId;
    this.createdBy = createdBy;
  }
}
