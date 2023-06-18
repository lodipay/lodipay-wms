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
import { FilterDto } from '../../common/dto/filter.dto';
import { CreateInventoryLocationDto } from './dto/create-inventory-location.dto';
import { UpdateInventoryLocationDto } from './dto/update-inventory-location.dto';
import { InventoryLocationService } from './inventory-location.service';

@Controller('inventory-location')
export class InventoryLocationController {
    constructor(
        private readonly inventoryLocationService: InventoryLocationService,
    ) {}

    @Post()
    create(@Body() createInventoryLocationDto: CreateInventoryLocationDto) {
        return this.inventoryLocationService.create(createInventoryLocationDto);
    }

    @Get()
    search(@Query() filterDto: FilterDto) {
        return this.inventoryLocationService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoryLocationService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateInventoryLocationDto: UpdateInventoryLocationDto,
    ) {
        return this.inventoryLocationService.update(
            +id,
            updateInventoryLocationDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.inventoryLocationService.remove(+id);
    }

    @Post(':id/positioned')
    updatePositionStatus(@Param('id') id: string) {
        return this.inventoryLocationService.updatePositionStatus(+id);
    }
}
