import {
    getEntityManagerDriverMockConfig,
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '@/common/mock';
import { FilterService } from '@/common/module/filter/filter.service';
import { QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { TransferSMService } from '../../common/module/state-machine/transfer-sm/transfer-sm.service';
import { Destination } from '../../database/entities/destination.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { Tenant } from '../../database/entities/tenant.entity';
import { TransferItem } from '../../database/entities/transfer-item.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { TenantService } from '../tenant/tenant.service';
import { TransferItemService } from '../transfer-item/transfer-item.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

describe('TransferController', () => {
    let controller: TransferController;
    let service: TransferService;

    const fromDestination = new Destination('Tolgoit', 'Tolgoit description');
    fromDestination.id = 1;
    const toDestination = new Destination('Zaisan', 'Zaisan description');
    toDestination.id = 2;

    const transfer1 = new Transfer(
        'transfer1',
        'transfer1 description',
        'user1',
    );
    transfer1.from = fromDestination;
    transfer1.to = toDestination;
    const transfer2 = new Transfer(
        'transfer2',
        'transfer2 description',
        'user2',
    );
    transfer2.from = fromDestination;
    transfer2.to = toDestination;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransferController],
            providers: [
                {
                    provide: TransferSMService,
                    useValue: {
                        machine: {
                            transition: () => jest.fn(),
                        },
                        service: jest.fn(),
                        getCurrentState: () => jest.fn(),
                    },
                },
                TransferService,
                TransferItemService,
                InventoryService,
                FilterService,
                WarehouseService,
                TenantService,
                getEntityManagerMockConfig(),
                getEntityManagerDriverMockConfig(),
                getRepositoryMockConfig(Destination),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Tenant),
                getRepositoryMockConfig(Transfer),
                getRepositoryMockConfig(TransferItem),
                getRepositoryMockConfig(Warehouse),
            ],
        }).compile();

        controller = module.get<TransferController>(TransferController);
        service = module.get<TransferService>(TransferService);
    });

    it('shoud create new transfer', async () => {
        const newTransferDto = {
            name: 'transfer1',
            description: 'transfer1 description',
            createdBy: 'user1',
            fromDestinationId: 1,
            toDestinationId: 2,
        };

        jest.spyOn(service, 'create').mockImplementation(
            (dto: CreateTransferDto) => {
                const transfer = new Transfer(
                    dto.name,
                    dto.description,
                    dto.createdBy,
                );
                fromDestination.id = dto.fromDestinationId;
                toDestination.id = dto.toDestinationId;
                transfer.from = fromDestination;
                transfer.to = toDestination;
                transfer.id = 1;

                return Promise.resolve(transfer);
            },
        );

        const result = await controller.create(newTransferDto);
        expect(result).toBeInstanceOf(Transfer);
        expect(result.id).toBe(1);
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.name).toBe(newTransferDto.name);
        expect(result.description).toBe(newTransferDto.description);
        expect(result.createdBy).toBe(newTransferDto.createdBy);
        expect(result.from).toBeInstanceOf(Destination);
        expect(result.from).toStrictEqual(fromDestination);
        expect(result.to).toBeInstanceOf(Destination);
        expect(result.to).toStrictEqual(toDestination);
    });

    it('should update an transfer', async () => {
        const result = new Transfer();
        jest.spyOn(service, 'update').mockImplementation(
            (id: number, dto: UpdateTransferDto) => {
                (result.name = dto.name),
                    (result.description = dto.description),
                    (result.createdBy = dto.createdBy);
                result.id = id;
                result.from = fromDestination;
                result.to = toDestination;
                result.createdAt = new Date();
                result.createdAt = new Date();
                return Promise.resolve(result);
            },
        );

        expect(
            await controller.update('1', { name: 'transfer10' }),
        ).toBeInstanceOf(Transfer);
        expect(
            await controller.update('1', { name: 'transfer10' }),
        ).toStrictEqual(result);
    });

    it('should find transfer by id', async () => {
        transfer1.id = 1;
        jest.spyOn(service, 'findOne').mockImplementation(id => {
            expect(id).toBe(transfer1.id);
            return Promise.resolve(transfer1);
        });

        expect(await controller.findOne(`${transfer1.id}`)).toEqual({
            ...transfer1,
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
                name: 'transfer1',
                description: 'Lorem ipsum dolor sit amet tasty',
                from: new Destination('Tolgoit', 'Tolgoit description'),
                to: new Destination('Zaisan', 'Zaisan description'),
            },
            {
                id: 2,
                name: 'transfer2',
                description: 'Lorem ipsum dolor sit amet',
                from: new Destination('Tolgoit', 'Tolgoit description'),
                to: new Destination('Zaisan', 'Zaisan description'),
            },
        ].map(data => plainToClass(Transfer, data));

        jest.spyOn(service, 'search').mockImplementation(filterDto => {
            expect(filterDto).toStrictEqual(query);
            const paginatedDto = new PaginatedDto();
            paginatedDto.data = result;
            paginatedDto.page = filterDto.page;
            paginatedDto.limit = filterDto.limit;
            paginatedDto.total = 100;
            paginatedDto.totalPage = 10;

            return Promise.resolve(paginatedDto);
        });

        const paginatedDto = new PaginatedDto();
        paginatedDto.data = result;
        paginatedDto.page = query.page;
        paginatedDto.limit = query.limit;
        paginatedDto.total = 100;
        paginatedDto.totalPage = 10;

        expect(await controller.search(query)).toStrictEqual(paginatedDto);
    });

    it('remove', async () => {
        jest.spyOn(service, 'remove').mockImplementation(() => {
            return Promise.resolve();
        });
        expect(await controller.remove('1')).toBe(undefined);
    });

    describe('change transfer state', () => {
        it('should change transfer status to active', async () => {
            jest.spyOn(service, 'activate').mockImplementation((id: number) => {
                expect(id).toBe(1);
                transfer1.status = TransferStatus.ACTIVE;
                transfer1.updatedAt = new Date();
                return Promise.resolve(transfer1);
            });

            expect(await controller.activateState('1')).toBe(transfer1);
        });

        it('should change transfer status to deactivated', async () => {
            jest.spyOn(service, 'deactivate').mockImplementation(
                (id: number) => {
                    expect(id).toBe(1);
                    transfer1.status = TransferStatus.INACTIVE;
                    transfer1.updatedAt = new Date();
                    return Promise.resolve(transfer1);
                },
            );

            expect(await controller.deactivateState('1')).toBe(transfer1);
        });

        it('should change transfer status to cancelled', async () => {
            jest.spyOn(service, 'cancel').mockImplementation((id: number) => {
                expect(id).toBe(1);
                transfer1.status = TransferStatus.CANCELLED;
                transfer1.updatedAt = new Date();
                return Promise.resolve(transfer1);
            });

            expect(await controller.cancelState('1')).toBe(transfer1);
        });

        it('should change transfer status to packing', async () => {
            jest.spyOn(service, 'packing').mockImplementation((id: number) => {
                expect(id).toBe(1);
                transfer1.status = TransferStatus.PACKING;
                transfer1.updatedAt = new Date();
                return Promise.resolve(transfer1);
            });
            expect(await controller.packingState('1')).toBe(transfer1);
        });

        it('should change transfer status to packed', async () => {
            jest.spyOn(service, 'packed').mockImplementation((id: number) => {
                expect(id).toBe(1);
                transfer1.status = TransferStatus.PACKED;
                transfer1.updatedAt = new Date();
                return Promise.resolve(transfer1);
            });
            expect(await controller.packedState('1')).toBe(transfer1);
        });

        it('should change transfer status to delivering', async () => {
            jest.spyOn(service, 'startDelivery').mockImplementation(
                (id: number) => {
                    expect(id).toBe(1);
                    transfer1.status = TransferStatus.DELIVERING;
                    transfer1.updatedAt = new Date();
                    return Promise.resolve(transfer1);
                },
            );
            expect(await controller.startDeliveryState('1')).toBe(transfer1);
        });

        it('should change transfer status to delivered', async () => {
            jest.spyOn(service, 'delivered').mockImplementation(
                (id: number) => {
                    expect(id).toBe(1);
                    transfer1.status = TransferStatus.DELIVERED;
                    transfer1.updatedAt = new Date();
                    return Promise.resolve(transfer1);
                },
            );
            expect(await controller.deliveredState('1')).toBe(transfer1);
        });

        it('should change transfer status to returning', async () => {
            jest.spyOn(service, 'return').mockImplementation((id: number) => {
                expect(id).toBe(1);
                transfer1.status = TransferStatus.RETURNING;
                transfer1.updatedAt = new Date();
                return Promise.resolve(transfer1);
            });
            expect(await controller.returnState('1')).toBe(transfer1);
        });

        it('should change transfer status to returned', async () => {
            jest.spyOn(service, 'returned').mockImplementation((id: number) => {
                expect(id).toBe(1);
                transfer1.status = TransferStatus.RETURNED;
                transfer1.updatedAt = new Date();
                return Promise.resolve(transfer1);
            });
            expect(await controller.returnedState('1')).toBe(transfer1);
        });

        it('should change transfer status to receiving', async () => {
            jest.spyOn(service, 'startReceive').mockImplementation(
                (id: number) => {
                    expect(id).toBe(1);
                    transfer1.status = TransferStatus.RECEIVING;
                    transfer1.updatedAt = new Date();
                    return Promise.resolve(transfer1);
                },
            );
            expect(await controller.startReceiveState('1')).toBe(transfer1);
        });

        it('should change transfer status to received', async () => {
            jest.spyOn(service, 'received').mockImplementation((id: number) => {
                expect(id).toBe(1);
                transfer1.status = TransferStatus.DONE;
                transfer1.updatedAt = new Date();
                return Promise.resolve(transfer1);
            });
            expect(await controller.receivedState('1')).toBe(transfer1);
        });
    });
});
