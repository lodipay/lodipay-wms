import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Destination } from '../../../database/entities/destination.entity';

export class CreateDestinationDto extends OmitType(Destination, [
    'id',
    'warehouse',
    'createdAt',
    'updatedAt',
]) {
    @ApiProperty()
    @IsNumber()
    warehouseId?: number;

    constructor(name: string, description: string, warehouseId: number) {
        super();
        this.name = name;
        this.description = description;
        this.warehouseId = warehouseId;
    }
}
