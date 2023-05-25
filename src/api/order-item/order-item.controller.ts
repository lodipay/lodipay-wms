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
import { OrderItem } from '../../database/entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemService } from './order-item.service';

@Controller('order-item')
@ApiTags('Order Item')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) {}

    @Post()
    create(@Body() createOrderItemDto: CreateOrderItemDto) {
        return this.orderItemService.create(createOrderItemDto);
    }

    @Get()
    @ApiPaginatedResponse(OrderItem)
    search(@Query() filterDto: FilterDto) {
        return this.orderItemService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderItemService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateOrderItemDto: UpdateOrderItemDto,
    ) {
        return this.orderItemService.update(+id, updateOrderItemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderItemService.remove(+id);
    }
}
