import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGenericListResponse } from '../../common/decorator/api-generic-list-response.decorator';
import { ApiGenericResponse } from '../../common/decorator/api-generic-response.decorator';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseService } from './warehouse.service';

@Controller('warehouses')
@ApiTags('Warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiGenericResponse(Warehouse)
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  @Get()
  @ApiGenericListResponse(Warehouse)
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiGenericResponse(Warehouse)
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(parseInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehouseService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  @ApiGenericResponse()
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(parseInt(id));
  }
}
