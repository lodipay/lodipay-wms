import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { FilterDto } from '@/common/dto/filter.dto';
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
import { GoodsUnit } from '../../../database/entities/goods-unit.entity';
import { CreateGoodsUnitDto } from './dto/create-goods-unit.dto';
import { UpdateGoodsUnitDto } from './dto/update-goods-unit.dto';
import { GoodsUnitService } from './goods-unit.service';
@Controller('goods-unit')
@ApiTags('Goods unit')
export class GoodsUnitController {
    constructor(private readonly goodsUnitService: GoodsUnitService) {}

    @Post()
    create(@Body() createGoodsUnitDto: CreateGoodsUnitDto) {
        return this.goodsUnitService.create(createGoodsUnitDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsUnit)
    findAll(@Query() filterDto: FilterDto) {
        return this.goodsUnitService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsUnitService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGoodsUnitDto: UpdateGoodsUnitDto,
    ) {
        return this.goodsUnitService.update(+id, updateGoodsUnitDto);
    }
}
