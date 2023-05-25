import { InvalidArgumentException } from '@/common/exception/invalid.argument.exception';
import { FilterService } from '@/common/module/filter/filter.service';
import {
    Collection,
    EntityManager,
    EntityRepository,
    QueryOrder,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
    let service: InventoryService;
    let em: EntityManager;
    let repository: EntityRepository<Inventory>;
    let filterService: FilterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InventoryService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Inventory),
            ],
        }).compile();

        service = module.get<InventoryService>(InventoryService);
        filterService = module.get<FilterService>(FilterService);
        em = module.get<EntityManager>(EntityManager);
        repository = module.get<EntityRepository<Inventory>>(
            getRepositoryToken(Inventory),
        );
    });

    it('create', async () => {
        const data = {
            sku: 'SKU123123',
            name: 'Female Shirt',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 10,
            expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        };

        const expectedData = {
            id: 2,
            ...data,
        };

        jest.spyOn(em, 'assign').mockImplementation(
            (obj1: Inventory, obj2: CreateInventoryDto) => {
                const mergedObj = Object.assign({}, obj1, obj2);

                for (const key in mergedObj) {
                    obj1[key] = mergedObj[key];
                }

                return obj1;
            },
        );

        jest.spyOn(em, 'persistAndFlush').mockImplementation(
            (obj: Inventory) => {
                obj.id = expectedData.id;

                return Promise.resolve();
            },
        );

        const newInventory = new Inventory();
        newInventory.name = data.name;
        newInventory.sku = data.sku;
        newInventory.batchCode = data.batchCode;
        newInventory.description = data.description;
        newInventory.expireDate = new Date(data.expiryDate);
        newInventory.quantity = data.quantity;
        newInventory.weight = data.weight;

        const result = await service.create(newInventory);
        expect(result).toBeInstanceOf(Inventory);
        expect(result.children).toBeInstanceOf(Collection);
        expect(result.children).toHaveLength(0);

        delete result.children;
        delete expectedData.expiryDate;
        const plainResult = { ...result };
        expect(plainResult).toEqual({
            ...expectedData,
            expireDate: expect.any(Date),
            warehouses: expect.any(Collection),
        });
    });

    it('findOne', async () => {
        const data = {
            id: 3,
            sku: 'SKU123123',
            name: 'Female Shirt',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 10,
            expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        };

        const entity = plainToClass(Inventory, data);

        jest.spyOn(repository, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(entity.id);
                return Promise.resolve(entity);
            },
        );

        expect(await service.findOne(3)).toStrictEqual(entity);
    });

    it('update', async () => {
        const data = {
            id: 3,
            sku: 'SKU123123',
            name: 'Female Shirt',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 10,
            expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        };

        const entity = plainToClass(Inventory, data);

        jest.spyOn(service, 'findOne').mockImplementation(id => {
            expect(id).toBe(entity.id);
            return Promise.resolve(entity);
        });

        jest.spyOn(em, 'assign').mockImplementation(
            (obj1: Inventory, obj2: UpdateInventoryDto) => {
                const mergedObj = Object.assign({}, obj1, obj2);

                for (const key in mergedObj) {
                    obj1[key] = mergedObj[key];
                }

                return obj1;
            },
        );

        const resultEntity = plainToClass(Inventory, {
            ...data,
            name: 'Man shirt',
        });

        expect(
            await service.update(3, {
                name: resultEntity.name,
            }),
        ).toStrictEqual(resultEntity);
    });

    it('remove', async () => {
        const data = {
            id: 3,
            sku: 'SKU123123',
            name: 'Female Shirt',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            quantity: 10,
            expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
            batchCode: 'BATCH123',
            weight: 10,
        };

        const entity = plainToClass(Inventory, data);

        jest.spyOn(repository, 'findOne').mockImplementation(
            (options: any): any => {
                expect(options.id).toBe(entity.id);
                return Promise.resolve(entity);
            },
        );

        expect(await service.remove(3)).toStrictEqual('deleted');
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

        const result = [
            {
                id: 3,
                sku: 'SKU123123',
                name: 'Female Shirt',
                description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                quantity: 10,
                expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                batchCode: 'BATCH123',
                weight: 10,
            },
            {
                id: 4,
                sku: 'SKU123124',
                name: 'Female Shirt2',
                description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                quantity: 10,
                expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                batchCode: 'BATCH123',
                weight: 10,
            },
        ].map(data => plainToClass(Inventory, data));
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

    it('should throw exception on setParent when entity is not found', async () => {
        jest.spyOn(repository, 'findOne')
            .mockImplementationOnce((options: any) => {
                expect(options.id).toBe(3);
                return Promise.resolve(null);
            })
            .mockImplementationOnce((options: any): any => {
                expect(options.id).toBe(4);
                const data = {
                    id: 4,
                    sku: 'SKU123123',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };

                return Promise.resolve(plainToClass(Inventory, data));
            });
        await expect(service.setParent(3, 4)).rejects.toThrow(
            InvalidArgumentException,
        );
    });

    it('should throw exception on setParent when parent is not found', async () => {
        jest.spyOn(repository, 'findOne')
            .mockImplementationOnce((options: any): any => {
                expect(options.id).toBe(3);
                const data = {
                    id: options.id,
                    sku: 'SKU123123',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };

                return Promise.resolve(plainToClass(Inventory, data));
            })
            .mockImplementationOnce((options: any): any => {
                expect(options.id).toBe(4);
                return Promise.resolve(null);
            });
        await expect(service.setParent(3, 4)).rejects.toThrow(
            InvalidArgumentException,
        );
    });

    it('should throw exception on when the parent is a child', async () => {
        jest.spyOn(repository, 'findOne')
            .mockImplementationOnce((options: any): any => {
                expect(options.id).toBe(3);
                const data = {
                    id: options.id,
                    sku: 'SKU123123',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };

                return Promise.resolve(plainToClass(Inventory, data));
            })
            .mockImplementationOnce((options: any): any => {
                const parentData = {
                    id: 5,
                    sku: 'SKU123125',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };

                expect(options.id).toBe(4);

                const data = {
                    id: options.id,
                    sku: 'SKU123124',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };
                const entity = plainToClass(Inventory, data);
                entity.parent = plainToClass(Inventory, parentData);

                return Promise.resolve(entity);
            });
        await expect(service.setParent(3, 4)).rejects.toThrow(
            InvalidArgumentException,
        );
    });

    it('should throw exception on when entity and parent are the same', async () => {
        await expect(service.setParent(3, 3)).rejects.toThrow(
            InvalidArgumentException,
        );
    });

    it('setParent', async () => {
        jest.spyOn(repository, 'findOne')
            .mockImplementationOnce((options: any): any => {
                expect(options.id).toBe(3);
                const data = {
                    id: options.id,
                    sku: 'SKU123123',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };

                return Promise.resolve(plainToClass(Inventory, data));
            })
            .mockImplementationOnce((options: any): any => {
                expect(options.id).toBe(4);

                const data = {
                    id: options.id,
                    sku: 'SKU123124',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };
                const entity = plainToClass(Inventory, data);

                return Promise.resolve(entity);
            });
        const entity = await service.setParent(3, 4);
        expect(entity.parent).not.toBeNull();
        expect(entity.parent.id).toBe(4);
    });

    it('unsetParent', async () => {
        jest.spyOn(repository, 'findOne').mockImplementationOnce(
            (options: any): any => {
                expect(options.id).toBe(3);
                const data = {
                    id: options.id,
                    sku: 'SKU123123',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };

                const parentData = {
                    id: 5,
                    sku: 'SKU123125',
                    name: 'Female Shirt',
                    description:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    quantity: 10,
                    expiryDate: DateTime.now().plus({ year: 1 }).toISO(),
                    batchCode: 'BATCH123',
                    weight: 10,
                };

                const entity = plainToClass(Inventory, data);
                entity.parent = plainToClass(Inventory, parentData);

                return Promise.resolve(entity);
            },
        );
        const entity = await service.unsetParent(3);
        expect(entity.parent).toBeNull();
    });
});
