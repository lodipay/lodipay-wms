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
import { GoodsShape } from '../../../database/entities/goods-shape.entity';
import { CreateGoodsShapeDto } from './dto/create-goods-shape.dto';
import { UpdateGoodsShapeDto } from './dto/update-goods-shape.dto';
import { GoodsShapeService } from './goods-shape.service';
@Controller('goods-shape')
@ApiTags('Goods shape')
export class GoodsBrandController {
    constructor(private readonly goodsShapeService: GoodsShapeService) {}

    @Post()
    create(@Body() createGoodsShapeDto: CreateGoodsShapeDto) {
        return this.goodsShapeService.create(createGoodsShapeDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsShape)
    search(@Query() filterDto: FilterDto) {
        return this.goodsShapeService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsShapeService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGoodsShapeDto: UpdateGoodsShapeDto,
    ) {
        return this.goodsShapeService.update(+id, updateGoodsShapeDto);
    }
}
