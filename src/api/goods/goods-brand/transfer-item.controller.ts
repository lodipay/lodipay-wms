// import {
//     Body,
//     Controller,
//     Delete,
//     Get,
//     Param,
//     Patch,
//     Post,
//     Query,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { ApiPaginatedResponse } from '../../common/decorator/api-paginated-response.decorator';
// import { FilterDto } from '../../common/dto/filter.dto';
// import { TransferItem } from '../../database/entities/transfer-item.entity';
// import { CreateGoodsBrandDto } from './dto/create-goods-brand.dto';
// import { UpdateGoodsBrandDto } from './dto/update-goods-brand.dto';
// import { TransferItemService } from './goods-brand.service';

// @Controller('transfer-item')
// @ApiTags('Transfer Item')
// export class TransferItemController {
//     constructor(private readonly transferItemService: TransferItemService) {}

//     @Post()
//     create(@Body() createGoodsBrandDto: CreateGoodsBrandDto) {
//         return this.transferItemService.create(createGoodsBrandDto);
//     }

//     @Get()
//     @ApiPaginatedResponse(TransferItem)
//     search(@Query() filterDto: FilterDto) {
//         return this.transferItemService.search(filterDto);
//     }

//     @Get(':id')
//     findOne(@Param('id') id: string) {
//         return this.transferItemService.findOne(+id);
//     }

//     @Patch(':id')
//     update(
//         @Param('id') id: string,
//         @Body() updateGoodsBrandDto: UpdateGoodsBrandDto,
//     ) {
//         return this.transferItemService.update(+id, updateGoodsBrandDto);
//     }

//     @Delete(':id')
//     remove(@Param('id') id: string) {
//         return this.transferItemService.remove(+id);
//     }
// }
