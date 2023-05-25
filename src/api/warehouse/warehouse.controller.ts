import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiGenericListResponse } from '../../common/decorator/api-generic-list-response.decorator';
import { ApiGenericResponse } from '../../common/decorator/api-generic-response.decorator';
import { ApiPaginatedResponse } from '../../common/decorator/api-paginated-response.decorator';
import { FilterDto } from '../../common/dto/filter.dto';
import { WarehouseInventory } from '../../database/entities/warehouse-inventory.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { AssignWarehouseInventoryDto } from './dto/assign-warehouse-inventory.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseInventoryDto } from './dto/update-warehouse-inventory.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
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
    update(
        @Param('id') id: string,
        @Body() updateWarehouseDto: UpdateWarehouseDto,
    ) {
        return this.warehouseService.update(+id, updateWarehouseDto);
    }

    @Delete(':id')
    @ApiGenericResponse('string')
    remove(@Param('id') id: string) {
        return this.warehouseService.remove(parseInt(id));
    }

    @Post(':id/inventories')
    async assignInventory(
        @Param('id') id: string,
        @Body() assignWhInventoryDto: AssignWarehouseInventoryDto,
    ) {
        return this.warehouseService.assignInventory(+id, assignWhInventoryDto);
    }

    @Get(':id/inventories')
    @ApiPaginatedResponse(WarehouseInventory)
    async getInventories(@Query() filterDto: FilterDto) {
        return this.warehouseService.getInventories(filterDto);
    }

    @Patch(':warehouseId/inventories/:inventoryId')
    async updateInventory(
        @Param('warehouseId') warehouseId: string,
        @Param('inventoryId') inventoryId: string,
        @Body() updateWarehouseInventoryDto: UpdateWarehouseInventoryDto,
    ) {
        return this.warehouseService.updateInventory(
            +warehouseId,
            +inventoryId,
            updateWarehouseInventoryDto,
        );
    }

    @Delete(':warehouseId/inventories/:inventoryId')
    async deleteInventory(
        @Param('warehouseId') warehouseId: string,
        @Param('inventoryId') inventoryId: string,
    ) {
        return this.warehouseService.removeInventory(
            +warehouseId,
            +inventoryId,
        );
    }
}
