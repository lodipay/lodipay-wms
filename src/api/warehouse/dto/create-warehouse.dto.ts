import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @ApiProperty({ example: 'WH1', description: 'Warehouse name' })
  readonly name: string;

  @IsString()
  @ApiProperty({ example: 'warehouse 1', description: 'Warehouse description' })
  readonly description: string;
}
