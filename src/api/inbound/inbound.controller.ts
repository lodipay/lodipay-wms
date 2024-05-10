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
import { Supplier } from '../../database/entities/supplier.entity';
import { CreateAsnDto } from './dto/create-asn.dto';
import { UpdateAsnDto } from './dto/update-asn.dto';
import { InboundService } from './inbound.service';

@Controller('inbound')
@ApiTags('Inbound')
export class inboundController {
    constructor(private readonly inboundService: InboundService) {}

    @Post('asn')
    createAsn(@Body() createAsnDto: CreateAsnDto) {
        return this.inboundService.createAsn(createAsnDto);
    }

    @Get()
    @ApiPaginatedResponse(Supplier)
    search(@Query() filterDto: FilterDto) {
        return this.inboundService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.inboundService.findOne(+id);
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
