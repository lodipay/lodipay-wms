import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { FilterDto } from '@/common/dto/filter.dto';
import { GoodsBrand } from '@/database/entities/goods-brand.entity';
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
import { CreateGoodsBrandDto } from './dto/create-goods-brand.dto';
import { UpdateGoodsBrandDto } from './dto/update-goods-brand.dto';
import { GoodsBrandService } from './goods-brand.service';
@Controller('goods-brand')
@ApiTags('Goods brand')
export class GoodsBrandController {
    constructor(private readonly goodsBrandService: GoodsBrandService) {}

    @Post()
    create(@Body() createGoodsBrandDto: CreateGoodsBrandDto) {
        return this.goodsBrandService.create(createGoodsBrandDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsBrand)
    search(@Query() filterDto: FilterDto) {
        return this.goodsBrandService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.goodsBrandService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateGoodsBrandDto: UpdateGoodsBrandDto,
    ) {
        return this.goodsBrandService.update(+id, updateGoodsBrandDto);
    }
}
