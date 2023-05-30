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

    @Post('update-state/:id/activate')
    activateState(@Param('id') id: string) {
        return this.transferService.activate(+id);
    }

    @Post('update-state/:id/deactivate')
    deactivateState(@Param('id') id: string) {
        return this.transferService.deactivate(+id);
    }

    @Post('update-state/:id/cancel')
    cancelState(@Param('id') id: string) {
        return this.transferService.cancel(+id);
    }

    @Post('update-state/:id/packing')
    packingState(@Param('id') id: string) {
        return this.transferService.packing(+id);
    }

    @Post('update-state/:id/packed')
    packedState(@Param('id') id: string) {
        return this.transferService.packed(+id);
    }

    @Post('update-state/:id/start-delivery')
    startDeliveryState(@Param('id') id: string) {
        return this.transferService.startDelivery(+id);
    }

    @Post('update-state/:id/delivered')
    deliveredState(@Param('id') id: string) {
        return this.transferService.delivered(+id);
    }

    @Post('update-state/:id/return')
    returnState(@Param('id') id: string) {
        return this.transferService.return(+id);
    }

    @Post('update-state/:id/returned')
    returnedState(@Param('id') id: string) {
        return this.transferService.returned(+id);
    }

    @Post('update-state/:id/start-receive')
    startReceiveState(@Param('id') id: string) {
        return this.transferService.startReceive(+id);
    }

    @Post('update-state/:id/received')
    receivedState(@Param('id') id: string) {
        return this.transferService.received(+id);
    }
}
