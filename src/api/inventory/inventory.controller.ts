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
import { ApiPaginatedResponse } from '../../common/decorator/api-paginated-response.decorator';
import { FilterDto } from '../../common/dto/filter.dto';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@Controller('inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Post()
    create(@Body() createInventoryDto: CreateInventoryDto) {
        return this.inventoryService.create(createInventoryDto);
    }

    @Get()
    @ApiPaginatedResponse(Inventory)
    search(@Query() filterDto: FilterDto) {
        return this.inventoryService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inventoryService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
    ) {
        return this.inventoryService.update(+id, updateInventoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.inventoryService.remove(+id);
    }

    @Post(':id/set-parent/:parentId')
    setParent(@Param('id') id: string, @Param('parentId') parentId: string) {
        return this.inventoryService.setParent(+id, +parentId);
    }

    @Post(':id/unset-parent')
    unsetParent(@Param('id') id: string) {
        return this.inventoryService.unsetParent(+id);
    }
}
