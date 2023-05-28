import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, EntityRepository, QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { Inventory } from '../../database/entities/inventory.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { CreateTransferItemDto } from './dto/create-transfer-item.dto';
import { TransferItemService } from './transfer-item.service';

describe('TransferItemService', () => {
    let service: TransferItemService;
    let transferRepo: EntityRepository<Transfer>;
    let transferItemRepo: EntityRepository<TransferItem>;
    let inventoryRepo: EntityRepository<Inventory>;
    let em: EntityManager;
    let filterService: FilterService;
    let createDto: CreateTransferItemDto;
    let transfer: Transfer;
    let transfer2: Transfer;
    let transferItem: TransferItem;
    let inventory: Inventory;
    let inventory2: Inventory;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                TransferItemService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Transfer),
                getRepositoryMockConfig(TransferItem),
                getRepositoryMockConfig(Inventory),
            ],
        });

        service = module.get<TransferItemService>(TransferItemService);
        em = module.get<EntityManager>(EntityManager);
        transferRepo = module.get<EntityRepository<Transfer>>(
            getRepositoryToken(Transfer),
        );
        transferItemRepo = module.get<EntityRepository<TransferItem>>(
            getRepositoryToken(TransferItem),
        );
        inventoryRepo = module.get<EntityRepository<Inventory>>(
            getRepositoryToken(Inventory),
        );
        filterService = module.get<FilterService>(FilterService);

        createDto = {
            transferId: 3,
            inventoryId: 5,
            description: 'Lorem ipsum',
            inventoryAmount: 100,
        };

        transfer = plainToClass(Transfer, {
            id: 3,
            name: 'Transfer 1',
            description: 'Transfer 1 description',
            createdBy: 'Admin 1',
        });

        transfer2 = plainToClass(Transfer, {
            id: 15,
            name: 'Transfer 2',
            description: 'Transfer 2 description',
            createdBy: 'Admin 2',
        });

        inventory = plainToClass(Inventory, {
            id: 5,
            sku: 'SKU123123',
            name: 'Female Shirt',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 10,
            expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        });

        transfer2 = plainToClass(Transfer, {
            id: 15,
            name: 'Transfer 2',
            description: 'Transfer 2 description',
            createdBy: 'Admin 2',
        });

        inventory = plainToClass(Inventory, {
            id: 5,
            sku: 'SKU123123',
            name: 'Female Shirt',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 10,
            expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        });

        inventory2 = plainToClass(Inventory, {
            id: 15,
            sku: '2SKU123123',
            name: 'Male Shirt',
            description:
                '2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 100,
            expiryDate: DateTime.now().plus({ year: 2 }).toISO(),
            batchCode: '2BATCH123',
            weight: 100,
        });

        transferItem = new TransferItem();
        transferItem.description = createDto.description;
        transferItem.inventoryAmount = createDto.inventoryAmount;
        transferItem.inventory = inventory;
        transferItem.transfer = transfer;
    });

    describe('transferItem create', () => {
        it('should create a new transfer item', async () => {
            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(inventoryRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(inventory.id);
                    return Promise.resolve(inventory);
                },
            );

            jest.spyOn(transfer.transferItems, 'add').mockImplementation(
                (): any => {
                    return Promise.resolve();
                },
            );

            const createdDate = new Date();
            jest.spyOn(em, 'persistAndFlush').mockImplementation(
                (entities): any => {
                    entities[0].id = transfer.id;
                    entities[1].id = transferItem.id = 5;
                    entities[1].transfer = transfer;
                    entities[1].inventory = inventory;
                    entities[1].createdAt = createdDate;
                    entities[1].description = createDto.description;
                    entities[1].inventoryAmount = createDto.inventoryAmount;
                    return Promise.resolve();
                },
            );

            expect(await service.create(createDto)).toBeInstanceOf(
                TransferItem,
            );
            const responseData = await service.create(createDto);
            expect(responseData.createdAt).toEqual(expect.any(Date));
            expect(responseData.inventory).toBeInstanceOf(Inventory);
            expect(responseData.inventoryAmount).toBe(
                createDto.inventoryAmount,
            );
            expect(responseData.description).toBe(createDto.description);
        });

        it('should throw an error if transfer not found', async () => {
            const exception = expect(
                service.create({ ...createDto, transferId: 4 }),
            ).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('Transfer not found');
        });

        it('should throw an error if inventory not found', async () => {
            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            const exception = expect(
                service.create({ ...createDto, inventoryId: 6 }),
            ).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('Inventory not found');
        });
    });

    describe('transferItem update', () => {
        it('should update an transfer item without updating transfer or inventory', async () => {
            const transferId = 3;
            transferItem.id = transferId;

            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(transferItem.id);
                    return Promise.resolve(transferItem);
                },
            );

            const updateDto = {
                description: 'UPDATED Lorem ipsum',
                inventoryAmount: 200,
            };

            jest.spyOn(transferItemRepo, 'upsert').mockImplementation(
                (entity): any => {
                    expect(entity.id).toBe(transferItem.id);
                    entity.description = updateDto.description;
                    entity.inventoryAmount = updateDto.inventoryAmount;
                    entity.updatedAt = new Date();
                    return Promise.resolve(transferItem);
                },
            );

            expect(await service.update(transferItem.id, updateDto)).toEqual(
                transferItem,
            );
        });

        it('should update an transfer item with updating transfer or inventory', async () => {
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(transferItem.id);
                    return Promise.resolve(transferItem);
                },
            );

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(transfer2.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(inventoryRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(inventory2.id);
                    return Promise.resolve(inventory);
                },
            );

            const updateDto = {
                description: 'UPDATED Lorem ipsum',
                inventoryAmount: 200,
                transferId: transfer2.id,
                inventoryId: inventory2.id,
            };

            jest.spyOn(transferItemRepo, 'upsert').mockImplementation(
                (entity: TransferItem): any => {
                    expect(entity.id).toBe(transferItem.id);
                    entity.description = updateDto.description;
                    entity.inventoryAmount = updateDto.inventoryAmount;
                    entity.inventory = inventory2;
                    entity.transfer = transfer2;
                    entity.updatedAt = new Date();
                    return Promise.resolve(transferItem);
                },
            );

            expect(await service.update(transferItem.id, updateDto)).toEqual(
                transferItem,
            );
        });

        it('should throw an error if transfer item not found', async () => {
            const exception = await expect(service.update(100, createDto))
                .rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('TransferItem not found');
        });
    });

    it('should search', async () => {
        const query = {
            page: 2,
            limit: 10,
            query: {
                filter: {
                    name: {
                        $ilike: '%tasty%',
                    },
                },
                order: {
                    name: QueryOrder.DESC,
                },
            },
        };

        const transferItem2 = new TransferItem();
        transferItem2.description = 'Lorem ipsum';
        transferItem2.inventoryAmount = 100;
        transferItem2.inventory = inventory;
        transferItem2.transfer = transfer;

        const result = [transferItem, transferItem2];
        jest.spyOn(filterService, 'search').mockImplementation(
            (_, filterDto) => {
                expect(filterDto).toStrictEqual(query);
                const paginatedDto = new PaginatedDto();
                paginatedDto.result = result;
                paginatedDto.page = filterDto.page;
                paginatedDto.limit = filterDto.limit;
                paginatedDto.total = 100;
                paginatedDto.totalPage = 10;

                return Promise.resolve(paginatedDto);
            },
        );

        const paginatedDto = new PaginatedDto();
        paginatedDto.result = result;
        paginatedDto.page = query.page;
        paginatedDto.limit = query.limit;
        paginatedDto.total = 100;
        paginatedDto.totalPage = 10;

        expect(await service.search(query)).toStrictEqual(paginatedDto);
    });

    describe('transferItem remove', () => {
        it('should remove an transfer item', async () => {
            transferItem.id = 1;
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transferItem.id);
                    return Promise.resolve(transferItem);
                },
            );

            jest.spyOn(em, 'removeAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transferItem);

                    return Promise.resolve();
                },
            );

            expect(await service.remove(transferItem.id)).toStrictEqual(
                'deleted',
            );
        });

        it('should throw error when the transfer item is not found', async () => {
            transferItem.id = 1;
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transferItem.id);
                    return Promise.resolve(null);
                },
            );

            await expect(service.remove(transferItem.id)).rejects.toThrow(
                InvalidArgumentException,
            );
        });
    });
});
