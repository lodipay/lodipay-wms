import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { FilterDto } from '@/common/dto/filter.dto';
import { GoodsColor } from '@/database/entities/goods-color.entity';
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
import { CreateGoodsColorDto } from './dto/create-goods-color.dto';
import { UpdateGoodsColorDto } from './dto/update-goods-color.dto';
import { GoodsColorService } from './goods-color.service';
@Controller('goods-color')
@ApiTags('Goods color')
export class GoodsColorController {
    constructor(private readonly goodsColorService: GoodsColorService) {}

    @Post()
    create(@Body() createGoodsColorDto: CreateGoodsColorDto) {
        return this.goodsColorService.create(createGoodsColorDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsColor)
    search(@Query() filterDto: FilterDto) {
        return this.goodsColorService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsColorService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGoodsColorDto: UpdateGoodsColorDto,
    ) {
        return this.goodsColorService.update(+id, updateGoodsColorDto);
    }
}
