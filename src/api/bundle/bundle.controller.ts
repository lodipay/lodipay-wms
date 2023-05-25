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
import { Bundle } from '../../database/entities/bundle.entity';
import { BundleService } from './bundle.service';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';

@Controller('bundle')
@ApiTags('Bundle')
export class BundleController {
    constructor(private readonly bundleService: BundleService) {}

    @Post()
    create(@Body() createBundleDto: CreateBundleDto) {
        return this.bundleService.create(createBundleDto);
    }

    @Get()
    @ApiPaginatedResponse(Bundle)
    search(@Query() filterDto: FilterDto) {
        return this.bundleService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bundleService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBundleDto: UpdateBundleDto) {
        return this.bundleService.update(+id, updateBundleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bundleService.remove(+id);
    }
}
