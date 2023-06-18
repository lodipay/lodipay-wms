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
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { CreateTenantItemDto } from './dto/create-tenant-item.dto';
import { UpdateTenantItemDto } from './dto/update-tenant-item.dto';
import { TenantItemService } from './tenant-item.service';

@Controller('tenant-item')
@ApiTags('Tenant item')
export class TenantItemController {
    constructor(private readonly bundleService: TenantItemService) {}

    @Post()
    create(@Body() createTenantDto: CreateTenantItemDto) {
        return this.bundleService.create(createTenantDto);
    }

    @Get()
    @ApiPaginatedResponse(TenantItem)
    search(@Query() filterDto: FilterDto) {
        return this.bundleService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bundleService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTenantDto: UpdateTenantItemDto,
    ) {
        return this.bundleService.update(+id, updateTenantDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bundleService.remove(+id);
    }
}
