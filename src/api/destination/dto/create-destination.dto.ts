import { OmitType } from '@nestjs/swagger';
import { Destination } from '../../../database/entities/destination.entity';

export class CreateDestinationDto extends OmitType(Destination, ['id', 'from', 'to', 'warehouse', 'createdAt', 'updatedAt']) {}
