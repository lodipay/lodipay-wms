import { FilterService } from '@/common/module/filter/filter.service';
import { QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { Inventory } from '../../database/entities/inventory.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { UpdateTransferItemDto } from './dto/update-transfer-item.dto';
import { TransferItemController } from './transfer-item.controller';
import { TransferItemService } from './transfer-item.service';

describe('TransferItemController', () => {
    let controller: TransferItemController;
    let service: TransferItemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransferItemController],
            providers: [
                TransferItemService,
                FilterService,
                getRepositoryMockConfig(Transfer),
                getRepositoryMockConfig(TransferItem),
                getRepositoryMockConfig(Inventory),
                getEntityManagerMockConfig(),
            ],
        }).compile();

        controller = module.get<TransferItemController>(TransferItemController);
        service = module.get<TransferItemService>(TransferItemService);
    });

    it('should create new transfer item', async () => {
        const data = {
            transferId: 1,
            inventoryId: 3,
            inventoryAmount: 5,
            description: 'Lorem ipsum dolor sit amet',
        };

        const result = plainToClass(TransferItem, { ...data, id: 2 });
        jest.spyOn(service, 'create').mockImplementation(() => {
            result.id = 1;
            result.createdAt = new Date();
            return Promise.resolve(result);
        });

        expect(
            await controller.create(plainToClass(CreateTransferItemDto, data)),
        ).toEqual(result);
    });

    it('should find transfer by id', async () => {
        const data = {
            id: 5,
            transferId: 1,
            inventoryId: 3,
            inventoryAmount: 5,
            description: 'Lorem ipsum dolor sit amet',
        };

        jest.spyOn(service, 'findOne').mockImplementation(id => {
            expect(id).toBe(data.id);
            return Promise.resolve(plainToClass(TransferItem, data));
        });

        expect(await controller.findOne(`${data.id}`)).toEqual({
            ...data,
            createdAt: expect.any(Date),
        });
    });

    it('should update transfer item', async () => {
        const data = {
            id: 1,
            description: 'Lorem ipsum dolor sit amet',
            inventoryAmount: 1000,
            inventoryId: 3,
            transferId: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updateValues = {
            description: 'UPDATE Lorem ipsum dolor sit amet',
        };

        jest.spyOn(service, 'update').mockImplementation(
            (id: number, dto: UpdateTransferItemDto) => {
                expect(id).toBe(data.id);
                expect(dto.description).toBe(updateValues.description);

                return Promise.resolve(
                    plainToClass(TransferItem, {
                        ...data,
                        ...dto,
                    }),
                );
            },
        );

        expect(
            await controller.update(`${data.id}`, updateValues),
        ).toBeInstanceOf(TransferItem);
        expect(await controller.update(`${data.id}`, updateValues)).toEqual({
            ...plainToClass(TransferItem, {
                ...data,
                description: updateValues.description,
            }),
            createdAt: expect.any(Date),
        });
    });

    it('should search', async () => {
        const query = {
            page: 2,
            limit: 10,
            query: {
                filter: {
                    description: {
                        $ilike: '%tasty%',
                    },
                },
                order: {
                    id: QueryOrder.ASC,
                },
            },
        };

        const result = [
            {
                id: 1,
                description: 'Lorem ipsum dolor sit amet tasty',
                inventoryAmount: 1000,
                inventoryId: 8,
                transferId: 5,
            },
            {
                id: 2,
                description: 'Lorem ipsum dolor sit amet',
                inventoryAmount: 4000,
                inventoryId: 9,
                transferId: 4,
            },
        ].map(data => plainToClass(Inventory, data));

        jest.spyOn(service, 'search').mockImplementation(filterDto => {
            expect(filterDto).toStrictEqual(query);
            const paginatedDto = new PaginatedDto();
            paginatedDto.result = result;
            paginatedDto.page = filterDto.page;
            paginatedDto.limit = filterDto.limit;
            paginatedDto.total = 100;
            paginatedDto.totalPage = 10;

            return Promise.resolve(paginatedDto);
        });

        const paginatedDto = new PaginatedDto();
        paginatedDto.result = result;
        paginatedDto.page = query.page;
        paginatedDto.limit = query.limit;
        paginatedDto.total = 100;
        paginatedDto.totalPage = 10;

        expect(await controller.search(query)).toStrictEqual(paginatedDto);
    });

    it('remove', async () => {
        const result = 'deleted';
        jest.spyOn(service, 'remove').mockImplementation(() => {
            return Promise.resolve(result);
        });
        expect(await controller.remove('1')).toBe(result);
    });
});
