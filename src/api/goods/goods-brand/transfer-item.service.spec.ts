import { FilterService } from '@/common/module/filter/filter.service';
import { QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
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
import { TransferItemService } from './transfer-item.service';

describe('TransferItemService', () => {
    let service: TransferItemService;
    let transferRepo: EntityRepository<Transfer>;
    let transferItemRepo: EntityRepository<TransferItem>;
    let inventoryRepo: EntityRepository<Inventory>;
    let tenantRepo: EntityRepository<Tenant>;
    let em: EntityManager;
    let filterService: FilterService;
    let createDto: CreateTransferItemDto;
    let transfer: Transfer;
    let transfer2: Transfer;
    let transferItem: TransferItem;
    let inventory: Inventory;
    let inventory2: Inventory;
    let destination1: Destination;
    let destination2: Destination;
    let tenant1: Tenant;
    let tenant2: Tenant;
    let transferService: TransferService;
    let warehouseService: WarehouseService;
    let tenantService: TenantService;
    let inventoryService: InventoryService;
    let warehouse: Warehouse;
    let warehouse2: Warehouse;
    let tenantItem1: TenantItem;
    let tenantItem2: TenantItem;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                TransferItemService,
                FilterService,
                WarehouseService,
                TransferService,
                InventoryService,
                TenantService,
                TransferSMService,
                getEntityManagerMockConfig(),
                getEntityManagerDriverMockConfig(),
                getRepositoryMockConfig(Destination),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Transfer),
                getRepositoryMockConfig(TransferItem),
                getRepositoryMockConfig(Warehouse),
                getRepositoryMockConfig(Tenant),
            ],
        });

        service = module.get<TransferItemService>(TransferItemService);
        em = module.get<EntityManager>(EntityManager);
        tenantRepo = module.get<EntityRepository<Tenant>>(
            getRepositoryToken(Tenant),
        );
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
        transferService = module.get<TransferService>(TransferService);
        warehouseService = module.get<WarehouseService>(WarehouseService);
        tenantService = module.get<TenantService>(TenantService);
        inventoryService = module.get<InventoryService>(InventoryService);

        tenant1 = plainToClass(Tenant, {
            id: 1,
            name: 'Tenant 1',
            description: 'Tenant 1 description',
        });

        tenant2 = plainToClass(Tenant, {
            id: 2,
            name: 'Tenant 2',
            description: 'Tenant 2 description',
        });

        transfer = new Transfer();
        transfer.id = 1;
        transfer.name = 'Transfer 1';
        transfer.description = 'Transfer 1 description';
        transfer.createdBy = 'Admin 1';

        transfer2 = new Transfer();
        transfer2.id = 2;
        transfer2.name = 'Transfer 2';
        transfer2.description = 'Transfer 2 description';
        transfer2.createdBy = 'Admin 2';

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

        warehouse = new Warehouse();
        warehouse.id = 1;
        warehouse.name = 'Warehouse 1';
        warehouse.description = 'Warehouse 1 description';

        warehouse2 = new Warehouse();
        warehouse2.id = 1;
        warehouse2.name = 'Warehouse 2';
        warehouse2.description = 'Warehouse 2 description';

        destination1 = new Destination();
        destination1.name = 'Destination 1';
        destination1.description = 'Destination 1 desc';
        destination1.warehouse = warehouse;

        destination2 = new Destination();
        destination2.name = 'Destination 2';
        destination2.description = 'Destination 2 desc';
        destination2.warehouse = warehouse2;

        tenantItem1 = new TenantItem();
        tenantItem1.description = 'Tenant item description';
        tenantItem1.quantity = 10000;
        tenantItem1.damagedQuantity = 0;
        tenantItem1.tenant = tenant1;
        tenantItem1.inventory = inventory;

        tenantItem2 = new TenantItem();
        tenantItem2.description = 'Tenant item description';
        tenantItem2.quantity = 20000;
        tenantItem2.damagedQuantity = 0;
        tenantItem2.tenant = tenant1;
        tenantItem2.inventory = inventory2;

        createDto = {
            transferId: transfer.id,
            inventoryId: inventory.id,
            description: 'Lorem ipsum',
            quantity: 10,
            toTenantId: tenant1.id,
            fromTenantId: tenant2.id,
        };

        transferItem = new TransferItem();
        transferItem.description = createDto.description;
        transferItem.quantity = createDto.quantity;
        transferItem.inventory = inventory;
        transferItem.transfer = transfer;
    });

    describe('transferItem create', () => {
        it('should create a new transfer item', async () => {
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            jest.spyOn(tenantService, 'findOne')
                .mockImplementationOnce((): any => {
                    return Promise.resolve(tenant1);
                })
                .mockImplementationOnce((): any => {
                    return Promise.resolve(tenant2);
                });

            jest.spyOn(transferService, 'findOne').mockImplementation(
                (): any => {
                    transfer.id = 1;
                    transfer.status = TransferStatus.NEW;
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                warehouseService,
                'getWarehouseWithOptions',
            ).mockImplementation((): any => {
                warehouse.id = 1;
                tenantItem1.id = 1;
                tenantItem2.id = 1;
                tenantItem1.inventory.id = inventory.id;
                tenantItem2.inventory.id = inventory2.id;
                warehouse.tenantItem.add(tenantItem1);
                warehouse.tenantItem.add(tenantItem2);
                return Promise.resolve(warehouse);
            });

            jest.spyOn(em, 'createQueryBuilder').mockImplementation((): any => {
                return {
                    update: jest.fn(),
                    execute: Promise.resolve(),
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementation(
                (createDto: CreateTransferItemDto): any => {
                    transferItem.transfer = transfer;
                    transferItem.quantity = createDto.quantity;
                    transferItem.description = createDto.description;
                    transferItem.inventory = inventory;
                    transferItem.fromTenant = tenant1;
                    transferItem.toTenant = tenant2;
                    return Promise.resolve();
                },
            );

            jest.spyOn(inventoryService, 'findOne').mockImplementation(() => {
                return Promise.resolve(inventory);
            });

            const responseData = await service.create(createDto);
            expect(responseData).toBeInstanceOf(TransferItem);
            expect(responseData).toMatchObject({
                ...transferItem,
                createdAt: expect.any(Date),
                inventory: inventory,
            });
        });

        it('should throw an error if transfer item is found', async () => {
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
                (): any => {
                    return Promise.resolve(transferItem);
                },
            );

            const exception = expect(service.create(createDto)).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('TransferItem already exists');
        });

        it('should throw an error if transfer status is not new', async () => {
            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                transfer.status = TransferStatus.CANCELLED;
                return Promise.resolve(transfer);
            });

            const exception = expect(service.create(createDto)).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('Transfer status is not new');
        });

        it('should throw not enough tenant item quantity', async () => {
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                return Promise.resolve(undefined);
            });

            jest.spyOn(tenantService, 'findOne')
                .mockImplementationOnce((): any => {
                    return Promise.resolve(tenant1);
                })
                .mockImplementationOnce((): any => {
                    return Promise.resolve(tenant2);
                });

            jest.spyOn(transferService, 'findOne').mockImplementation(
                (): any => {
                    transfer.id = 1;
                    transfer.status = TransferStatus.NEW;
                    return Promise.resolve(transfer);
                },
            );

            transfer.from = destination1;
            transfer.to = destination2;

            jest.spyOn(
                warehouseService,
                'getWarehouseWithOptions',
            ).mockImplementation((): any => {
                return Promise.resolve(warehouse);
            });

            jest.spyOn(
                warehouseService,
                'getWarehouseWithOptions',
            ).mockImplementation((): any => {
                tenantItem1.quantity = 1;
                warehouse.tenantItem.add(tenantItem1);
                return Promise.resolve(warehouse);
            });

            const exception = expect(service.create(createDto)).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('Not enough tenant item quantity');
        });
    });

    describe('transferItem update', () => {
        it("should throw an error if transfer item inventoryId doesn't match", async () => {
            createDto.inventoryId = 10;

            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                transferItem.inventory.id = 100;
                return Promise.resolve(transferItem);
            });

            const exception = await expect(
                service.update(transferItem.id, createDto),
            ).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError(
                'Inventory cannot be changed. Delete this transfer item and create a new one',
            );
        });

        it('should throw an error if transfer item not found', async () => {
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                transferItem.fromTenant = tenant1;
                return Promise.resolve(transferItem);
            });

            createDto.fromTenantId = 100;

            const exception = await expect(
                service.update(transferItem.id, createDto),
            ).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError(
                'Tenant cannot be changed. Delete this transfer item and create a new one',
            );
        });

        it('should throw an error if tenant item quantity is not enough', async () => {
            const updateDto = { ...createDto };
            updateDto.quantity = 1000;

            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                transferItem.fromTenant = tenant2;
                return Promise.resolve(transferItem);
            });

            jest.spyOn(transferService, 'findOne').mockImplementation(() => {
                transfer.id = 1;
                transfer.status = TransferStatus.NEW;
                transfer.from = destination1;
                transfer.to = destination2;
                return Promise.resolve(transfer);
            });

            jest.spyOn(
                warehouseService,
                'getWarehouseWithOptions',
            ).mockImplementation((): any => {
                tenantItem1.quantity = 1;
                warehouse.tenantItem.add(tenantItem1);
                return Promise.resolve(warehouse);
            });

            const exception = await expect(
                service.update(transferItem.id, updateDto),
            ).rejects;

            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('Not enough tenant item quantity');
        });

        it('should update the transfer item quantity', async () => {
            const updateDto = { ...createDto };

            updateDto.quantity = 10;
            updateDto.inventoryId = 1;
            transferItem.quantity = 1000;
            transferItem.inventory.id = 1;
            transferItem.id = 1;

            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                transferItem.fromTenant = tenant2;
                return Promise.resolve(transferItem);
            });

            jest.spyOn(transferService, 'findOne').mockImplementation(() => {
                transfer.id = 1;
                transfer.status = TransferStatus.NEW;
                transfer.from = destination1;
                transfer.to = destination2;
                return Promise.resolve(transfer);
            });

            jest.spyOn(
                warehouseService,
                'getWarehouseWithOptions',
            ).mockImplementation((): any => {
                warehouse.tenantItem.add(tenantItem1);
                return Promise.resolve(warehouse);
            });

            jest.spyOn(em, 'createQueryBuilder').mockImplementation((): any => {
                return {
                    update: () => ({
                        where: () => ({
                            execute: () => jest.fn(),
                        }),
                    }),
                    set: jest.fn(),
                    where: jest.fn(),
                    execute: jest.fn(),
                    raw: jest.fn(),
                };
            });

            jest.spyOn(tenantService, 'findOne').mockImplementation(() => {
                return Promise.resolve(tenant1);
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementation((): any => {
                transferItem.quantity = updateDto.quantity;
                transferItem.description = updateDto.description;
                return Promise.resolve();
            });

            const responseData = await service.update(
                transferItem.id,
                updateDto,
            );

            expect(responseData).toMatchObject(transferItem);
        });

        it('should update the transfer item quantity', async () => {
            const updateDto = { ...createDto };

            updateDto.quantity = 10;
            updateDto.inventoryId = 1;
            transferItem.quantity = 1;
            transferItem.inventory.id = 1;
            transferItem.id = 1;

            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                transferItem.fromTenant = tenant2;
                return Promise.resolve(transferItem);
            });

            jest.spyOn(transferService, 'findOne').mockImplementation(() => {
                transfer.id = 1;
                transfer.status = TransferStatus.NEW;
                transfer.from = destination1;
                transfer.to = destination2;
                return Promise.resolve(transfer);
            });

            jest.spyOn(
                warehouseService,
                'getWarehouseWithOptions',
            ).mockImplementation((): any => {
                warehouse.tenantItem.add(tenantItem1);
                return Promise.resolve(warehouse);
            });

            jest.spyOn(em, 'createQueryBuilder').mockImplementation((): any => {
                return {
                    update: () => ({
                        where: () => ({
                            execute: () => jest.fn(),
                        }),
                    }),
                    set: jest.fn(),
                    where: jest.fn(),
                    execute: jest.fn(),
                    raw: jest.fn(),
                };
            });

            jest.spyOn(tenantService, 'findOne').mockImplementation(() => {
                return Promise.resolve(tenant1);
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementation((): any => {
                transferItem.quantity = updateDto.quantity;
                transferItem.description = updateDto.description;
                return Promise.resolve();
            });

            const responseData = await service.update(
                transferItem.id,
                updateDto,
            );

            expect(responseData).toMatchObject(transferItem);
        });

        it('should remove the transfer item', async () => {
            jest.spyOn(transferItemRepo, 'findOne').mockImplementation(() => {
                return Promise.resolve(transferItem);
            });

            jest.spyOn(transferService, 'findOne').mockImplementation(() => {
                destination1.warehouse = warehouse;
                transfer.from = destination1;
                return Promise.resolve(transfer);
            });

            jest.spyOn(service, 'returnTenantItem').mockImplementation(
                (): any => {
                    return Promise.resolve(tenantItem1);
                },
            );

            jest.spyOn(em, 'createQueryBuilder').mockImplementation((): any => {
                return Promise.resolve();
            });

            expect(await service.remove(transferItem.id)).toBe('deleted');
        });

        it('should test the returnTenantItem method', async () => {
            destination1.id = 1;
            transfer.from = destination1;
            jest.spyOn(
                warehouseService,
                'getWarehouseWithOptions',
            ).mockImplementation((): any => {
                warehouse.tenantItem.add(tenantItem1);
                return Promise.resolve(warehouse);
            });

            jest.spyOn(em, 'createQueryBuilder').mockImplementation((): any => {
                return {
                    update: () => ({
                        where: () => ({
                            execute: () => jest.fn(),
                        }),
                    }),
                    raw: jest.fn(),
                };
            });

            const result = await service.returnTenantItem(
                transfer,
                transferItem,
            );
            expect(result).toBeUndefined();
        });

        // it('should update an transfer item without updating transfer or inventory', async () => {
        //     const transferId = 3;
        //     transferItem.id = transferId;

        //     jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
        //         (id: number): any => {
        //             expect(id).toBe(transferItem.id);
        //             return Promise.resolve(transferItem);
        //         },
        //     );

        //     const updateDto = {
        //         description: 'UPDATED Lorem ipsum',
        //         quantity: 200,
        //     };

        //     jest.spyOn(transferItemRepo, 'upsert').mockImplementation(
        //         (entity): any => {
        //             expect(entity.id).toBe(transferItem.id);
        //             entity.description = updateDto.description;
        //             entity.quantity = updateDto.quantity;
        //             entity.updatedAt = new Date();
        //             return Promise.resolve(transferItem);
        //         },
        //     );

        //     expect(await service.update(transferItem.id, updateDto)).toEqual(
        //         transferItem,
        //     );
        // });

        // it('should update an transfer item with updating transfer or inventory', async () => {
        //     jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
        //         (id: number): any => {
        //             expect(id).toBe(transferItem.id);
        //             return Promise.resolve(transferItem);
        //         },
        //     );

        //     jest.spyOn(transferRepo, 'findOne').mockImplementation(
        //         (id: number): any => {
        //             expect(id).toBe(transfer2.id);
        //             return Promise.resolve(transfer);
        //         },
        //     );

        //     jest.spyOn(inventoryRepo, 'findOne').mockImplementation(
        //         (id: number): any => {
        //             expect(id).toBe(inventory2.id);
        //             return Promise.resolve(inventory);
        //         },
        //     );

        //     const updateDto = {
        //         description: 'UPDATED Lorem ipsum',
        //         quantity: 200,
        //         transferId: transfer2.id,
        //         inventoryId: inventory2.id,
        //     };

        //     jest.spyOn(transferItemRepo, 'upsert').mockImplementation(
        //         (entity: TransferItem): any => {
        //             expect(entity.id).toBe(transferItem.id);
        //             entity.description = updateDto.description;
        //             entity.quantity = updateDto.quantity;
        //             entity.inventory = inventory2;
        //             entity.transfer = transfer2;
        //             entity.updatedAt = new Date();
        //             return Promise.resolve(transferItem);
        //         },
        //     );

        //     expect(await service.update(transferItem.id, updateDto)).toEqual(
        //         transferItem,
        //     );
        // });

        // it('should throw an error if transfer item not found', async () => {
        //     const exception = await expect(service.update(100, createDto))
        //         .rejects;
        //     exception.toThrow(InvalidArgumentException);
        //     exception.toThrowError('TransferItem not found');
        // });
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
        transferItem2.quantity = 100;
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

    // describe('transferItem remove', () => {
    //     it('should remove an transfer item', async () => {
    //         transferItem.id = 1;
    //         jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
    //             (id): any => {
    //                 expect(id).toBe(transferItem.id);
    //                 return Promise.resolve(transferItem);
    //             },
    //         );

    //         jest.spyOn(em, 'removeAndFlush').mockImplementationOnce(
    //             (entity: any) => {
    //                 expect(entity).toStrictEqual(transferItem);

    //                 return Promise.resolve();
    //             },
    //         );

    //         expect(await service.remove(transferItem.id)).toStrictEqual(
    //             'deleted',
    //         );
    //     });

    //     it('should throw error when the transfer item is not found', async () => {
    //         transferItem.id = 1;
    //         jest.spyOn(transferItemRepo, 'findOne').mockImplementation(
    //             (id): any => {
    //                 expect(id).toBe(transferItem.id);
    //                 return Promise.resolve(null);
    //             },
    //         );

    //         await expect(service.remove(transferItem.id)).rejects.toThrow(
    //             InvalidArgumentException,
    //         );
    //     });
    // });
});
