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
import { Tenant } from '../../database/entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
@ApiTags('Tenant')
export class TenantController {
    constructor(private readonly tenantService: TenantService) {}

    @Post()
    create(@Body() createTenantDto: CreateTenantDto) {
        return this.tenantService.create(createTenantDto);
    }

    @Get()
    @ApiPaginatedResponse(Tenant)
    search(@Query() filterDto: FilterDto) {
        return this.tenantService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tenantService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
        return this.tenantService.update(+id, updateTenantDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tenantService.remove(+id);
    }
}
