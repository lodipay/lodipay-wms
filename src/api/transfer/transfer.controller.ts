import { ApiPaginatedResponse } from '@/common/decorator/api-paginated-response.decorator';
import { FilterDto } from '@/common/dto/filter.dto';
import { Transfer } from '@/database/entities/transfer.entity';
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
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransferService } from './transfer.service';

@Controller('transfer')
@ApiTags('Transfer')
export class TransferController {
    constructor(private readonly transferService: TransferService) {}

    @Post()
    create(@Body() createTransferDto: CreateTransferDto) {
        return this.transferService.create(createTransferDto);
    }

    /**
     * SearchApi
     */
    @Get()
    @ApiPaginatedResponse(Transfer)
    search(@Query() filterDto: FilterDto) {
        return this.transferService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transferService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateTransferDto: UpdateTransferDto,
    ) {
        return this.transferService.update(+id, updateTransferDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.transferService.remove(+id);
    }
}
