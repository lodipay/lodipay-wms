import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  code: string;

  @Type(() => Warehouse)
  @Expose()
  warehouse: Warehouse;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}
