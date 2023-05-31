import { PaginatedDto } from '@/common/dto/paginated.dto';
import { InvalidArgumentException } from '@/common/exception/invalid.argument.exception';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '@/common/mock';
import { FilterService } from '@/common/module/filter/filter.service';
import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { TransferSMService } from '../../common/module/state-machine/transfer-sm/transfer-sm.service';
import { Destination } from '../../database/entities/destination.entity';
import { Transfer } from '../../database/entities/transfer.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferService } from './transfer.service';

describe('TransferService', () => {
    let service: TransferService;
    let testTransfer: Transfer;
    let tolgoit: Destination;
    let zaisan: Destination;
    let guchinhoyr: Destination;
    let destRepo: EntityRepository<Destination>;
    let transferRepo: EntityRepository<Transfer>;
    let testTransferDto: CreateTransferDto;
    let em: EntityManager;
    let filterService: FilterService;
    let transferSMService: TransferSMService;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                TransferService,
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
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Transfer),
                getRepositoryMockConfig(Destination),
                getRepositoryMockConfig(Warehouse),
            ],
        });

        service = module.get<TransferService>(TransferService);
        transferSMService = module.get<TransferSMService>(TransferSMService);

        tolgoit = plainToClass(Destination, {
            id: 1,
            name: 'Tolgoit',
            description: 'Tolgoit description',
        });

        zaisan = plainToClass(Destination, {
            id: 2,
            name: 'Zaisan',
            description: 'Zaisan description',
        });

        guchinhoyr = plainToClass(Destination, {
            id: 3,
            name: 'Guchin hoyr',
            description: 'Guchin hoyr description',
        });

        zaisan = plainToClass(Destination, {
            id: 2,
            name: 'Zaisan',
            description: 'Zaisan description',
        });

        guchinhoyr = plainToClass(Destination, {
            id: 3,
            name: 'Guchin hoyr',
            description: 'Guchin hoyr description',
        });

        const testTransferData = {
            name: 'test ecommerce transfer',
            description: 'test ecommerce transfer description',
            fromDestinationId: zaisan.id,
            toDestinationId: tolgoit.id,
            createdBy: 'user1',
        };
        testTransfer = new Transfer(
            testTransferData.name,
            testTransferData.description,
            testTransferData.createdBy,
        );

        testTransferDto = new CreateTransferDto(
            testTransferData.name,
            testTransferData.description,
            testTransferData.fromDestinationId,
            testTransferData.toDestinationId,
            testTransferData.createdBy,
        );

        destRepo = module.get<EntityRepository<Destination>>(
            getRepositoryToken(Destination),
        );
        transferRepo = module.get<EntityRepository<Transfer>>(
            getRepositoryToken(Transfer),
        );
        em = module.get<EntityManager>(EntityManager);

        filterService = module.get<FilterService>(FilterService);
    });

    describe('create', () => {
        it('should create an transfer', async () => {
            const createDto = new CreateTransferDto(
                testTransferDto.name,
                testTransferDto.description,
                testTransferDto.fromDestinationId,
                testTransferDto.toDestinationId,
                testTransferDto.description,
            );

            jest.spyOn(destRepo, 'findOne')
                .mockImplementation(() => {
                    zaisan.id = 1;
                    return Promise.resolve(zaisan);
                })
                .mockImplementationOnce(() => {
                    tolgoit.id = 2;
                    return Promise.resolve(tolgoit);
                });

            const result = {
                name: createDto.name,
                description: createDto.description,
                createdBy: createDto.createdBy,
                status: undefined,
                from: zaisan,
                to: tolgoit,
                createdAt: undefined,
            };

            jest.spyOn(em, 'persistAndFlush').mockImplementation(
                (obj: Transfer) => {
                    obj.id = result['id'] = 1;
                    obj.createdAt = new Date();
                    obj.status = TransferStatus.NEW;
                    return Promise.resolve();
                },
            );

            expect(await service.create(createDto)).toBeInstanceOf(Transfer);
            expect(await service.create(createDto)).toMatchObject({
                ...result,
                status: TransferStatus.NEW,
                from: expect.any(Destination),
                to: expect.any(Destination),
                createdAt: expect.any(Date),
            });
        });

        it('should throw error when to and from destinations are same', () => {
            const createDto = new CreateTransferDto(
                testTransferDto.name,
                testTransferDto.description,
                zaisan.id,
                zaisan.id,
                testTransferDto.description,
            );

            const exception = expect(service.create(createDto)).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError(
                'From and to destinations cannot be the same',
            );
        });

        it('should throw error when from destination is null', () => {
            const createDto = new CreateTransferDto(
                testTransferDto.name,
                testTransferDto.description,
                null,
                zaisan.id,
                testTransferDto.description,
            );

            const exception = expect(service.create(createDto)).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('Invalid from destination');
        });

        it('should throw error when to destination is null', async () => {
            const createDto = new CreateTransferDto(
                testTransferDto.name,
                testTransferDto.description,
                zaisan.id,
                null,
                testTransferDto.description,
            );

            jest.spyOn(destRepo, 'findOne').mockImplementationOnce(
                (options: any): any => {
                    expect(options.id).toBe(zaisan.id);
                    return Promise.resolve(zaisan);
                },
            );

            const exception = expect(service.create(createDto)).rejects;
            exception.toThrow(InvalidArgumentException);
            exception.toThrowError('Invalid to destination');
        });
    });

    it('should find all transfers', async () => {
        const result = [];

        for (let i = 0; i < 2; i++) {
            const transfer = new Transfer();
            transfer.id = i;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = tolgoit;
            transfer.to = zaisan;
            result.push(transfer);
        }

        jest.spyOn(transferRepo, 'findAll').mockImplementation(() => {
            return Promise.resolve(result);
        });

        expect(await service.findAll()).toStrictEqual(result);
    });

    describe('findOne', () => {
        it('should find an transfer', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = tolgoit;
            transfer.to = zaisan;
            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(transfer);
            });
            expect(await service.findOne(1)).toBe(transfer);
        });

        it('should find an transfer', async () => {
            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(undefined);
            });
            await expect(service.findOne(1)).rejects.toThrow(
                InvalidArgumentException,
            );
        });
    });

    describe('update', () => {
        it('should update an transfer', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.status = TransferStatus.NEW;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = tolgoit;
            transfer.to = zaisan;

            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(transfer);
            });

            jest.spyOn(destRepo, 'findOne')
                .mockImplementationOnce((): any => {
                    return Promise.resolve(guchinhoyr);
                })
                .mockImplementationOnce((): any => {
                    return Promise.resolve(zaisan);
                });

            const updatedResult = new Transfer(
                testTransferDto.name,
                testTransferDto.description,
            );

            testTransfer.status = TransferStatus.DELIVERED;

            updatedResult.id = 1;
            updatedResult.name = testTransfer.name;
            updatedResult.description = testTransfer.description;
            updatedResult.createdBy = testTransfer.createdBy;
            updatedResult.status = testTransfer.status;
            updatedResult.updatedAt = new Date();
            updatedResult.createdAt = new Date();

            expect(
                await service.update(transfer.id, {
                    name: transfer.name,
                    description: transfer.description,
                    createdBy: transfer.createdBy,
                    fromDestinationId: zaisan.id,
                    toDestinationId: guchinhoyr.id,
                    status: testTransfer.status,
                }),
            ).toEqual({
                id: 1,
                name: transfer.name,
                description: transfer.description,
                createdBy: transfer.createdBy,
                from: expect.any(Destination),
                to: expect.any(Destination),
                updatedAt: expect.any(Date),
                createdAt: expect.any(Date),
                transferItems: expect.anything(),
                status: testTransfer.status,
            });
        });

        it('should throw error when the given toDestination is the same as the from destination', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;

            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(transfer);
            });

            const exceptionExpect = await expect(
                service.update(transfer.id, {
                    name: transfer.name,
                    description: transfer.description,
                    createdBy: transfer.createdBy,
                    toDestinationId: zaisan.id,
                }),
            ).rejects;

            exceptionExpect.toThrow(InvalidArgumentException);
            exceptionExpect.toThrowError(
                'From and to destinations cannot be the same',
            );
        });

        it('should throw error when the given toDestination is not found', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;

            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(transfer);
            });

            jest.spyOn(destRepo, 'findOne').mockImplementationOnce(
                (options: any): any => {
                    expect(options.id).toBe(123);
                    return Promise.resolve(null);
                },
            );

            const exceptionExpect = await expect(
                service.update(transfer.id, {
                    name: transfer.name,
                    description: transfer.description,
                    createdBy: transfer.createdBy,
                    toDestinationId: 123,
                }),
            ).rejects;

            exceptionExpect.toThrow(InvalidArgumentException);
            exceptionExpect.toThrowError('Invalid to destination');
        });

        it('should throw error when the given toDestination is not found', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;

            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(transfer);
            });

            jest.spyOn(destRepo, 'findOne').mockImplementationOnce(
                (options: any): any => {
                    expect(options.id).toBe(123);
                    return Promise.resolve(null);
                },
            );

            const exceptionExpect = await expect(
                service.update(transfer.id, {
                    name: transfer.name,
                    description: transfer.description,
                    createdBy: transfer.createdBy,
                    toDestinationId: 123,
                }),
            ).rejects;

            exceptionExpect.toThrow(InvalidArgumentException);
            exceptionExpect.toThrowError('Invalid to destination');
        });

        it('should throw error when the given fromDestination is same as the to destination', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;

            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(transfer);
            });

            jest.spyOn(destRepo, 'findOne').mockImplementationOnce(
                (options: any): any => {
                    expect(options.id).toBe(tolgoit.id);
                    return Promise.resolve(tolgoit);
                },
            );

            const exceptionExpect = await expect(
                service.update(transfer.id, {
                    name: transfer.name,
                    description: transfer.description,
                    createdBy: transfer.createdBy,
                    fromDestinationId: tolgoit.id,
                }),
            ).rejects;

            exceptionExpect.toThrow(InvalidArgumentException);
            exceptionExpect.toThrowError(
                'From and to destinations cannot be the same',
            );
        });

        it('should throw error when the given fromDestination is not found', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;

            jest.spyOn(transferRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(transfer);
            });

            jest.spyOn(destRepo, 'findOne').mockImplementationOnce(
                (options: any): any => {
                    expect(options.id).toBe(123);
                    return Promise.resolve(null);
                },
            );

            const exceptionExpect = await expect(
                service.update(transfer.id, {
                    name: transfer.name,
                    description: transfer.description,
                    createdBy: transfer.createdBy,
                    fromDestinationId: 123,
                }),
            ).rejects;

            exceptionExpect.toThrow(InvalidArgumentException);
            exceptionExpect.toThrowError('Invalid from destination');
        });
    });

    it('search', async () => {
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

        const entity = new Transfer('Transfer', '#123121');
        entity.from = tolgoit;
        entity.to = zaisan;

        const result = [testTransfer, entity];
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

    describe('remove', () => {
        it('should remove an transfer', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(em, 'removeAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);

                    return Promise.resolve();
                },
            );

            await service.remove(transfer.id);
        });
    });

    describe('change state', () => {
        it('should change state of a transfer to active', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.NEW;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.ACTIVE,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.ACTIVE;
                    return Promise.resolve();
                },
            );

            expect(await service.activate(transfer.id)).toEqual(transfer);
        });

        it('should throw state is not changed by state machine', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.NEW;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.NEW,
                    changed: false,
                };
            });

            await expect(service.activate(transfer.id)).rejects.toThrow(
                InvalidArgumentException,
            );
        });

        it('should change state of a transfer to inactive', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.ACTIVE;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.INACTIVE,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.ACTIVE;
                    return Promise.resolve();
                },
            );

            expect(await service.deactivate(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to cancel', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.NEW;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.CANCELLED,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.CANCELLED;
                    return Promise.resolve();
                },
            );

            expect(await service.cancel(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to packing', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.ACTIVE;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.PACKING,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.PACKING;
                    return Promise.resolve();
                },
            );

            expect(await service.packing(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to packed', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.PACKING;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.PACKED,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.PACKED;
                    return Promise.resolve();
                },
            );

            expect(await service.packed(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to delivering', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.PACKED;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.DELIVERING,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.DELIVERING;
                    return Promise.resolve();
                },
            );

            expect(await service.startDelivery(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to delivered', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.DELIVERING;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.DELIVERED,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.DELIVERED;
                    return Promise.resolve();
                },
            );

            expect(await service.delivered(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to returning', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.DELIVERING;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.RETURNING,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.RETURNING;
                    return Promise.resolve();
                },
            );

            expect(await service.return(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to returned', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.RETURNING;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.RETURNED,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.RETURNED;
                    return Promise.resolve();
                },
            );

            expect(await service.returned(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to receiving', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.DELIVERED;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.RECEIVING,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.RECEIVING;
                    return Promise.resolve();
                },
            );

            expect(await service.startReceive(transfer.id)).toEqual(transfer);
        });

        it('should change state of a transfer to received', async () => {
            const transfer = new Transfer();
            transfer.id = 1;
            transfer.name = testTransfer.name;
            transfer.description = testTransfer.description;
            transfer.createdBy = testTransfer.createdBy;
            transfer.createdAt = new Date();
            transfer.updatedAt = new Date();
            transfer.from = zaisan;
            transfer.to = tolgoit;
            transfer.status = TransferStatus.RECEIVING;

            jest.spyOn(transferRepo, 'findOne').mockImplementation(
                (id): any => {
                    expect(id).toBe(transfer.id);
                    return Promise.resolve(transfer);
                },
            );

            jest.spyOn(
                transferSMService.machine,
                'transition',
            ).mockImplementation((): any => {
                return {
                    value: TransferStatus.DONE,
                    changed: true,
                };
            });

            jest.spyOn(em, 'persistAndFlush').mockImplementationOnce(
                (entity: any) => {
                    expect(entity).toStrictEqual(transfer);
                    entity.status = TransferStatus.DONE;
                    return Promise.resolve();
                },
            );

            expect(await service.received(transfer.id)).toEqual(transfer);
        });
    });
});
