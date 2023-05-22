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
import { BundleHolder } from '../../database/entities/bundle-holder.entity';
import { BundleHolderService } from './bundle-holder.service';
import { CreateBundleHolderDto } from './dto/create-bundle-holder.dto';
import { UpdateBundleHolderDto } from './dto/update-bundle-holder.dto';

@Controller('bundle-holder')
@ApiTags('Bundle Holder')
export class BundleHolderController {
  constructor(private readonly bundleHolderService: BundleHolderService) {}

  @Post()
  create(@Body() createBundleHolderDto: CreateBundleHolderDto) {
    return this.bundleHolderService.create(createBundleHolderDto);
  }

  @Get()
  @ApiPaginatedResponse(BundleHolder)
  search(@Query() filterDto: FilterDto) {
    return this.bundleHolderService.search(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bundleHolderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBundleHolderDto: UpdateBundleHolderDto,
  ) {
    return this.bundleHolderService.update(+id, updateBundleHolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bundleHolderService.remove(+id);
  }
}
