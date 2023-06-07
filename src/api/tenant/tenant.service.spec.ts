import {
    Collection,
    EntityManager,
    EntityRepository,
    QueryOrder,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Tenant } from '../../database/entities/tenant.entity';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
    let service: TenantService;
    let tenantRepo: EntityRepository<Tenant>;
    let tenant1: Tenant;
    let tenant2: Tenant;
    let filterService: FilterService;
    let em: EntityManager;

    beforeEach(async () => {
        const module: TestingModule = await getTestingModule({
            providers: [
                TenantService,
                FilterService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Tenant),
            ],
        });

        service = module.get<TenantService>(TenantService);
        filterService = module.get<FilterService>(FilterService);
        tenantRepo = module.get<EntityRepository<Tenant>>(
            getRepositoryToken(Tenant),
        );
        em = module.get<EntityManager>(EntityManager);

        tenant1 = plainToClass(Tenant, {
            name: 'Tenant holder 1',
            description: 'Tenant holder 1 description',
        });
        tenant2 = plainToClass(Tenant, {
            name: 'Tenant holder 2',
            description: 'Tenant holder 2 description',
        });
    });

    it('should create a tenantItem holder', async () => {
        jest.spyOn(em, 'persistAndFlush').mockImplementation((obj: Tenant) => {
            obj.id = tenant1.id = 1;
            obj.createdAt = new Date();
            return Promise.resolve();
        });

        expect(
            await service.create({
                name: tenant1.name,
                description: tenant1.description,
            }),
        ).toBeInstanceOf(Tenant);

        expect(
            await service.create({
                name: tenant1.name,
                description: tenant1.description,
            }),
        ).toMatchObject({
            ...tenant1,
            createdAt: expect.any(Date),
            tenantItems: expect.any(Collection<Tenant>),
        });
    });

    it('should find tenantItem holder by id', async () => {
        tenant1.id = 1;
        jest.spyOn(tenantRepo, 'findOne').mockImplementation(
            (id: number): any => {
                expect(id).toBe(tenant1.id);
                return Promise.resolve(tenant1);
            },
        );

        expect(await service.findOne(tenant1.id)).toBeInstanceOf(Tenant);
        expect(await service.findOne(tenant1.id)).toEqual(tenant1);
    });

    describe('update', () => {
        it('should throw error when tenantItem holder not found', async () => {
            const searchId = 123;
            jest.spyOn(tenantRepo, 'findOne').mockImplementation(
                (id: number): any => {
                    expect(id).toBe(searchId);

                    return Promise.resolve(null);
                },
            );

            await expect(
                service.update(searchId, {
                    name: tenant1.name,
                    description: tenant1.description,
                }),
            ).rejects.toThrow(InvalidArgumentException);
        });

        it('should update tenantItem holder', async () => {
            const updateData = {
                id: 1,
                name: 'Updated name',
                description: 'Updated description',
            };

            jest.spyOn(tenantRepo, 'findOne').mockImplementation((id): any => {
                expect(id).toBe(updateData.id);
                tenant1.id = updateData.id;
                tenant1.createdAt = new Date();
                return Promise.resolve(tenant1);
            });

            jest.spyOn(em, 'assign').mockImplementation(
                (obj1: Tenant, obj2: UpdateTenantDto) => {
                    obj1.name = obj2.name || obj2.name;
                    obj1.description = obj2.description || obj1.description;
                    return obj1;
                },
            );

            jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
                return Promise.resolve();
            });
            tenant1.updatedAt = new Date();
            tenant1.name = updateData.name;
            tenant1.description = updateData.description;

            expect(
                await service.update(updateData.id, {
                    name: updateData.name,
                    description: updateData.description,
                }),
            ).toBeInstanceOf(Tenant);
            expect(
                await service.update(updateData.id, {
                    name: updateData.name,
                    description: updateData.description,
                }),
            ).toEqual(tenant1);
        });
    });

    it('search', async () => {
        const query = {
            page: 2,
            limit: 10,
            query: {
                filter: {
                    name: {
                        $ilike: '%holder%',
                    },
                },
                order: {
                    name: QueryOrder.DESC,
                },
            },
        };

        const result = [tenant1, tenant2];

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

    it('should remove', async () => {
        tenant1.id = 1;
        jest.spyOn(service, 'findOne').mockImplementation((id: number): any => {
            expect(id).toBe(tenant1.id);
            return Promise.resolve(tenant1);
        });

        expect(await service.remove(1)).toStrictEqual('success');
    });
});
