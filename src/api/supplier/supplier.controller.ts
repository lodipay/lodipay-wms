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
import { Supplier } from '../../database/entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierService } from './supplier.service';

@Controller('supplier')
@ApiTags('Supplier')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) {}

    @Post()
    create(@Body() createSupplierDto: CreateSupplierDto) {
        return this.supplierService.create(createSupplierDto);
    }

    @Get()
    @ApiPaginatedResponse(Supplier)
    search(@Query() filterDto: FilterDto) {
        return this.supplierService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.supplierService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSupplierDto: UpdateSupplierDto,
    ) {
        return this.supplierService.update(+id, updateSupplierDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.supplierService.remove(+id);
    }
}
