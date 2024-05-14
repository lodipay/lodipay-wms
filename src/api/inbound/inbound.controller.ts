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
import { CreateAsnDto } from './dto/create-asn.dto';
import { UpdateAsnDto } from './dto/update-asn.dto';
import { InboundService } from './inbound.service';
import { Asnlist } from '@/database/entities/asn-list.entity';

@Controller('inbound')
@ApiTags('Inbound')
export class InboundController {
    constructor(private readonly inboundService: InboundService) {}

    @Post('asn')
    createAsn(@Body() createAsnDto: CreateAsnDto) {
        return this.inboundService.createAsn(createAsnDto);
    }

    @Get()
    @ApiPaginatedResponse(Asnlist)
    search(@Query() filterDto: FilterDto) {
        return this.inboundService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inboundService.findAsnListOne(+id);
    }

    @Post('asndetail/:id')
    updateAsnDetail(@Param('id') id: string, @Body() updateAsnDto: UpdateAsnDto) {
        return this.inboundService.updateAsnDetail(+id, updateAsnDto);
    }

    @Post('confirm-arrival/:id')
    confirmArrival(@Param('id') id: string) {
        return this.inboundService.confirmArrival(+id);
    }
    @Post('confirm-unloading/:id')
    confirmUnloading(@Param('id') id: string) {
        return this.inboundService.confirmUnloading(+id);
    }
    @Post('confirm-sorting/:id')
    confirmSorting(@Param('id') id: string, @Body() goods: Array<{ goodsCode: string; goodsActualQty: number}>) {
        return this.inboundService.confirmSorting(+id, goods);
    }
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAsnDto: UpdateAsnDto,
    ) {
        return this.inboundService.update(+id, updateAsnDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.inboundService.remove(+id);
    }
}
