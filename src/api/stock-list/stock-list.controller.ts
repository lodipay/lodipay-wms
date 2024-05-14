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
import { CreateStocckListDto } from './dto/create-stock-list.dto';
import { UpdateStockListDto } from './dto/update-stock-list.dto';
import { StockListService } from './stock-list.service';
import { CreateStockListHoldDto } from './dto/create-stock-list-hold.dto';
@Controller('stock-list')
@ApiTags('Stock List')
export class StockListController {
    constructor(private readonly stockListService: StockListService) {}

    @Post()
    create(@Body() createStocckListDto: CreateStocckListDto) {
        return this.stockListService.create(createStocckListDto);
    }

    @Get()
    @ApiPaginatedResponse(GoodsBrand)
    search(@Query() filterDto: FilterDto) {
        return this.stockListService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stockListService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateStockListDto: UpdateStockListDto,
    ) {
        return this.stockListService.update(+id, updateStockListDto);
    }
}
