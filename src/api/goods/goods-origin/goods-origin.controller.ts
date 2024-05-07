import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { FilterDto } from '@/common/dto/filter.dto';
import { GoodsOrigin } from '@/database/entities/goods-origin.entity';
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
import { CreateGoodsOriginDto } from './dto/create-goods-origin.dto';
import { UpdateGoodsOriginDto } from './dto/update-goods-origin.dto';
import { GoodsOriginService } from './goods-origin.service';
@Controller('goods-origin')
@ApiTags('Goods origin')
export class GoodsOriginController {
    constructor(private readonly goodsOriginService: GoodsOriginService) {}

    @Post()
    create(@Body() createGoodsOriginDto: CreateGoodsOriginDto) {
        return this.goodsOriginService.create(createGoodsOriginDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsOrigin)
    search(@Query() filterDto: FilterDto) {
        return this.goodsOriginService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsOriginService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGoodsOriginDto: UpdateGoodsOriginDto,
    ) {
        return this.goodsOriginService.update(+id, updateGoodsOriginDto);
    }
}
