import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { FilterDto } from '@/common/dto/filter.dto';
import { GoodsClass } from '@/database/entities/goods-class.entity';
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
import { CreateGoodsClassDto } from './dto/create-goods-class.dto';
import { UpdateGoodsClassDto } from './dto/update-goods-class.dto';
import { GoodsClassService } from './goods-class.service';
@Controller('goods-class')
@ApiTags('Goods class')
export class GoodsClassController {
    constructor(private readonly goodsClassService: GoodsClassService) {}

    @Post()
    create(@Body() createGoodsClassDto: CreateGoodsClassDto) {
        return this.goodsClassService.create(createGoodsClassDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsClass)
    search(@Query() filterDto: FilterDto) {
        return this.goodsClassService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsClassService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGoodsClassDto: UpdateGoodsClassDto,
    ) {
        return this.goodsClassService.update(+id, updateGoodsClassDto);
    }
}
