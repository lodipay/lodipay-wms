import { IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
    @IsString()
    code: string;

    @IsNumber()
    warehouseId: number;

    @IsString()
    description?: string;
}
