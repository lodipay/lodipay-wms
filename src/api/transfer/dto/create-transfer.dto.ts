import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransferDto {
    @IsString()
    name?: string;

    @IsString()
    description?: string;

    @IsString()
    createdBy?: string;

    @IsNumber()
    @IsOptional()
    fromDestinationId?: number;

    @IsNumber()
    toDestinationId: number;

    constructor(
        name?: string,
        description?: string,
        fromDestinationId?: number,
        toDestinationId?: number,
        createdBy?: string,
    ) {
        this.name = name;
        this.description = description;
        this.fromDestinationId = fromDestinationId;
        this.toDestinationId = toDestinationId;
        this.createdBy = createdBy;
    }
}
