import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { FilterDto } from '@/common/dto/filter.dto';
import { GoodsSpecs } from '@/database/entities/goods-specs.entity';
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGoodsSpecsDto } from './dto/create-goods-specs.dto';
import { UpdateGoodsSpecsDto } from './dto/update-goods-specs.dto';
import { GoodsSpecsService } from './goods-specs.service';
@Controller('goods-specs')
@ApiTags('Goods specs')
export class GoodsSpecsController {
    constructor(private readonly goodsSpecsService: GoodsSpecsService) {}

    @Post()
    create(@Body() createGoodsSpecsDto: CreateGoodsSpecsDto) {
        return this.goodsSpecsService.create(createGoodsSpecsDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsSpecs)
    search(@Query() filterDto: FilterDto) {
        return this.goodsSpecsService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsSpecsService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGoodsSpecsDto: UpdateGoodsSpecsDto,
    ) {
        return this.goodsSpecsService.update(+id, updateGoodsSpecsDto);
    }
}
