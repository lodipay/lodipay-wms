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
import { Goods } from '../../../database/entities/goods.entity';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { UpdateGoodsDto } from './dto/update-goods.dto';
import { GoodsService } from './goods.service';
@Controller('goods')
@ApiTags('Goods')
export class GoodsController {
    constructor(private readonly goodsService: GoodsService) {}

    @Post()
    create(@Body() createGoodsDto: CreateGoodsDto) {
        return this.goodsService.create(createGoodsDto);
    }

    @Get()
    @ApiPaginatedResponse(Goods)
    search(@Query() filterDto: FilterDto) {
        return this.goodsService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGoodsDto: UpdateGoodsDto) {
        return this.goodsService.update(+id, updateGoodsDto);
    }
}
