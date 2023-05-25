import { IsString } from 'class-validator';

export class CreateWarehouseDto {
    /**
     * Warehouse name
     * @example WH1
     */
    @IsString()
    readonly name: string;

    /**
     * Warehouse description
     * @example 'Warehouse 1'
     */
    @IsString()
    readonly description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}
