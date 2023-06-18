import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { faker } from '@mikro-orm/seeder';
import { TestingModule } from '@nestjs/testing';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Destination } from '../../database/entities/destination.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { InventoryService } from '../inventory/inventory.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';

describe('DestinationService', () => {
    let service: DestinationService;
    let em: EntityManager;
    let destRepo: EntityRepository<Destination>;
    let whRepo: EntityRepository<Warehouse>;
    let warehouse: Warehouse;

    let createDto: CreateDestinationDto;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                getEntityManagerMockConfig(),
                DestinationService,
                FilterService,
                InventoryService,
                WarehouseService,
                getRepositoryMockConfig(Destination),
                getRepositoryMockConfig(Inventory),
                getRepositoryMockConfig(Warehouse),
            ],
        });

        createDto = new CreateDestinationDto();
        createDto.name = faker.address.street();
        createDto.description = faker.address.streetAddress();
        createDto.warehouseId = 1;

        service = module.get<DestinationService>(DestinationService);
        em = module.get<EntityManager>(EntityManager);
        destRepo = module.get<EntityRepository<Destination>>(
            getRepositoryToken(Destination),
        );
        whRepo = module.get<EntityRepository<Warehouse>>(
            getRepositoryToken(Warehouse),
        );
        warehouse = new Warehouse(
            faker.company.name(),
            faker.company.catchPhrase(),
        );
        warehouse.id = 1;
    });

    it('should create destination without warehouse', async () => {
        const result = new Destination(createDto.name, createDto.description);

        jest.spyOn(em, 'persistAndFlush').mockImplementation(
            (obj: Destination) => {
                result.id = obj.id = 1;
                result.warehouse = undefined;

                return Promise.resolve();
            },
        );

        expect(
            await service.create({
                name: createDto.name,
                description: createDto.description,
            }),
        ).toEqual({
            ...result,
            createdAt: expect.any(Date),
        });
    });

    it('should create destination with warehouse', async () => {
        const result = new Destination(createDto.name, createDto.description);

        jest.spyOn(whRepo, 'findOne').mockImplementation((): any => {
            return Promise.resolve(warehouse);
        });

        jest.spyOn(em, 'persistAndFlush').mockImplementation(
            (obj: Destination) => {
                result.id = obj.id = 1;
                warehouse.id = 1;
                return Promise.resolve();
            },
        );

        result.warehouse = warehouse;
        result.createdAt = new Date();

        expect(await service.create(createDto)).toMatchObject({
            ...result,
            createdAt: expect.any(Date),
            warehouse: warehouse,
        });
    });

    it('should create destination without warehouse', async () => {
        const result = new Destination(createDto.name, createDto.description);

        jest.spyOn(em, 'persistAndFlush').mockImplementation(
            (obj: Destination) => {
                result.id = obj.id = 1;
                result.createdAt = new Date();

                return Promise.resolve();
            },
        );

        expect(await service.create(createDto)).toEqual({
            ...result,
            createdAt: expect.any(Date),
        });
    });

    it('should findAll', async () => {
        const result = [];
        const loopTimes = 5;
        for (let i = 0; i < loopTimes; i++) {
            const destination = new Destination(
                faker.address.street(),
                faker.address.streetAddress(),
            );
            destination.id = i + 1;
            if (i % 2 === 0) {
                const warehouse = new Warehouse(
                    faker.company.name(),
                    faker.company.catchPhrase(),
                );
                warehouse.id = i + 1;
                destination.warehouse = warehouse;
            }
            result.push(destination);
        }

        jest.spyOn(destRepo, 'findAll').mockImplementation((): any => {
            return Promise.resolve(result);
        });

        expect(await service.findAll()).toHaveLength(loopTimes);
        expect(await service.findAll()).toStrictEqual(result);
    });

    it('should findOne', async () => {
        const result = new Destination(createDto.name, createDto.description);
        result.id = 1;

        jest.spyOn(destRepo, 'findOne').mockImplementation((): any => {
            return Promise.resolve(result);
        });

        expect(await service.findOne(1)).toEqual({
            ...result,
            createdAt: expect.any(Date),
        });
    });

    describe('update', () => {
        it('should update without warehouse', async () => {
            const result = {
                id: 1,
                name: createDto.name,
                description: createDto.description,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(service, 'findOne').mockImplementation(() => {
                const destination = new Destination(
                    createDto.name,
                    createDto.description,
                );
                destination.id = result.id;

                return Promise.resolve(destination);
            });

            jest.spyOn(em, 'assign').mockImplementation(
                (obj1: Destination, obj2: Destination) => {
                    const mergedObj = { ...obj1, ...obj2 };
                    obj1.id = mergedObj.id;
                    obj1.name = mergedObj.name;
                    obj1.description = mergedObj.description;
                    obj1.updatedAt = new Date();

                    return obj1;
                },
            );

            const updatedResult = new Destination(
                createDto.name,
                createDto.description,
            );
            updatedResult.id = 1;
            updatedResult.createdAt = new Date();
            updatedResult.updatedAt = new Date();

            expect(
                await service.update(1, {
                    name: createDto.name,
                    description: createDto.description,
                }),
            ).toEqual({
                ...updatedResult,
                name: createDto.name,
                description: createDto.description,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should update with warehouse', async () => {
            const result = {
                id: 1,
                name: createDto.name,
                description: createDto.description,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(service, 'findOne').mockImplementation(() => {
                const destination = new Destination(
                    createDto.name,
                    createDto.description,
                );
                destination.id = result.id;
                destination.warehouse = warehouse;

                return Promise.resolve(destination);
            });

            jest.spyOn(whRepo, 'findOne').mockImplementation((): any => {
                return Promise.resolve(warehouse);
            });

            jest.spyOn(em, 'assign').mockImplementation(
                (obj1: Destination, obj2: Destination) => {
                    const mergedObj = { ...obj1, ...obj2 };
                    obj1.id = mergedObj.id;
                    obj1.name = mergedObj.name;
                    obj1.description = mergedObj.description;
                    obj1.updatedAt = new Date();
                    obj1.warehouse = warehouse;
                    return obj1;
                },
            );

            const updatedResult = new Destination(
                createDto.name,
                createDto.description,
            );
            updatedResult.id = 1;
            updatedResult.createdAt = new Date();
            updatedResult.updatedAt = new Date();
            updatedResult.warehouse = warehouse;

            expect(
                await service.update(1, {
                    name: createDto.name,
                    description: createDto.description,
                    warehouseId: warehouse.id,
                }),
            ).toEqual({
                ...updatedResult,
                name: createDto.name,
                description: createDto.description,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                warehouse: warehouse,
            });
        });
    });

    it('should remove', async () => {
        const result = new Destination(createDto.name, createDto.description);
        result.id = 1;

        jest.spyOn(destRepo, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(result.id);
                return Promise.resolve(result);
            },
        );

        expect(await service.remove(1)).toStrictEqual('deleted');
    });
});
