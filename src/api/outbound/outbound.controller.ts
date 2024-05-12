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
import { CreateDnDto } from './dto/create-dn.dto';
import { UpdateDnDto } from './dto/update-asn.dto';
import { OutboundService } from './outbound.service';
import { Dnlist } from '@/database/entities/dn-list';

@Controller('outbound')
@ApiTags('Outbound')
export class OutboundController {
    constructor(private readonly outboundService: OutboundService) {}

    @Post('dn')
    createDn(@Body() createDnDto: CreateDnDto) {
        return this.outboundService.createDn(createDnDto);
    }

    @Get()
    @ApiPaginatedResponse(Dnlist)
    search(@Query() filterDto: FilterDto) {
        return this.outboundService.search(filterDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.outboundService.findOne(+id);
    }

    @Post('dndetail/:id')
    updatDnDetail(@Param('id') id: string, @Body() updateDnDto: UpdateDnDto) {
        return this.outboundService.updateDnDetail(+id, updateDnDto);
    }

    // @Post('confirm/:id')
    // confirmAsn(@Param('id') id: string) {
    //     return this.outboundService.confirmAsn(+id);
    // }
    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateAsnDto: UpdateAsnDto,
    // ) {
    //     return this.outboundService.update(+id, updateAsnDto);
    // }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.outboundService.remove(+id);
    }
}
