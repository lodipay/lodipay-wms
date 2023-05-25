import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Controller('destination')
@ApiTags('Destination')
export class DestinationController {
    constructor(private readonly destinationService: DestinationService) {}

    @Post()
    create(@Body() createDestinationDto: CreateDestinationDto) {
        return this.destinationService.create(createDestinationDto);
    }

    @Get()
    findAll() {
        return this.destinationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.destinationService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateDestinationDto: UpdateDestinationDto,
    ) {
        return this.destinationService.update(+id, updateDestinationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.destinationService.remove(+id);
    }
}
