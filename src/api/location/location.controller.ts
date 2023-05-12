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
import { ApiGenericListResponse } from '../../common/decorator/api-generic-list-response.decorator';
import { ApiGenericResponse } from '../../common/decorator/api-generic-response.decorator';
import { Location } from '../../database/entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';

@Controller('location')
@ApiTags('Location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiGenericResponse(Location)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiGenericListResponse(Location)
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @ApiGenericResponse(Location)
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @ApiGenericResponse('string')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }
}
