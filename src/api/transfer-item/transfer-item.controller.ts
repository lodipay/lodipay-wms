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
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { UpdateTransferItemDto } from './dto/update-transfer-item.dto';
import { TransferItemService } from './transfer-item.service';

@Controller('transfer-item')
@ApiTags('Transfer Item')
export class TransferItemController {
    constructor(private readonly transferItemService: TransferItemService) {}

    @Post()
    create(@Body() createTransferItemDto: CreateTransferItemDto) {
        return this.transferItemService.create(createTransferItemDto);
    }

    @Get()
    @ApiPaginatedResponse(TransferItem)
    search(@Query() filterDto: FilterDto) {
        return this.transferItemService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transferItemService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTransferItemDto: UpdateTransferItemDto,
    ) {
        return this.transferItemService.update(+id, updateTransferItemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.transferItemService.remove(+id);
    }
}
