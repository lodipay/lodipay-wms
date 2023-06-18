import { FilterService } from '@/common/module/filter/filter.service';
import { QueryOrder } from '@mikro-orm/core';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import {
    getEntityManagerDriverMockConfig,
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { TransferSMService } from '../../common/module/state-machine/transfer-sm/transfer-sm.service';
import { Destination } from '../../database/entities/destination.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { TenantItem } from '../../database/entities/tenant-item.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { TenantService } from '../tenant/tenant.service';
import { TransferService } from '../transfer/transfer.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { TransferItemController } from './transfer-item.controller';
import { TransferItemService } from './transfer-item.service';

describe('TransferItemController', () => {
    let controller: TransferItemController;
    let service: TransferItemService;
    let transfer: Transfer;
    let transferItem1: TransferItem;
    let transferItem2: TransferItem;
    let warehouse1: Warehouse;
    let warehouse2: Warehouse;
    let tenantItem: TenantItem;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            controllers: [TransferItemController],
            providers: [
                FilterService,
                InventoryService,
                TenantService,
                TransferItemService,
                TransferService,
                TransferItemService,
                TransferSMService,
                WarehouseService,
                getRepositoryMockConfig(Destination),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Transfer),
                getRepositoryMockConfig(TransferItem),
                getRepositoryMockConfig(Tenant),
                getRepositoryMockConfig(Warehouse),
                getEntityManagerMockConfig(),
                getEntityManagerDriverMockConfig(),
            ],
        });

        controller = module.get<TransferItemController>(TransferItemController);
        service = module.get<TransferItemService>(TransferItemService);

        warehouse1 = new Warehouse();
        warehouse1.name = 'Warehouse 1';
        warehouse1.description = 'Warehouse 1 desc';

        warehouse2 = new Warehouse();
        warehouse2.name = 'Warehouse 2';
        warehouse2.description = 'Warehouse 2 desc';

        transfer = new Transfer();
        transfer.name = 'Transfer 1';
        transfer.status = TransferStatus.ACTIVE;
        transfer.to = warehouse1;

        transferItem1 = new TransferItem();
        transferItem1.quantity = 100;
        transferItem1.inventory = new Inventory();
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
        transferItem1.id = 1;

        const updateValues = {
            quantity: 300,
        };

        jest.spyOn(service, 'update').mockImplementation(
            (id, dto): Promise<TransferItem> => {
                expect(id).toBe(transferItem1.id);
                expect(dto.quantity).toBe(updateValues.quantity);
                transferItem1.quantity = dto.quantity;

                return Promise.resolve(transferItem1);
            },
        );

        const result = await controller.update(
            `${transferItem1.id}`,
            updateValues,
        );

        expect(result).toBeInstanceOf(TransferItem);
        expect(result).toEqual({
            ...transferItem1,
            quantity: updateValues.quantity,
        });

        // const data = {
        //     id: 1,
        //     description: 'Lorem ipsum dolor sit amet',
        //     inventoryAmount: 1000,
        //     inventoryId: 3,
        //     transferId: 5,
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        // };
        // const updateValues = {
        //     description: 'UPDATE Lorem ipsum dolor sit amet',
        // };
        // jest.spyOn(service, 'update').mockImplementation(
        //     (id: number, dto: UpdateTransferItemDto) => {
        //         expect(id).toBe(data.id);
        //         expect(dto.description).toBe(updateValues.description);
        //         return Promise.resolve(
        //             plainToClass(TransferItem, {
        //                 ...data,
        //                 ...dto,
        //             }),
        //         );
        //     },
        // );
        // expect(
        //     await controller.update(`${data.id}`, updateValues),
        // ).toBeInstanceOf(TransferItem);
        // expect(await controller.update(`${data.id}`, updateValues)).toEqual({
        //     ...plainToClass(TransferItem, {
        //         ...data,
        //         description: updateValues.description,
        //     }),
        //     createdAt: expect.any(Date),
        // });
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
