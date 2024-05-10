import { Collection, QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { Tenant } from '../../database/entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('TenantController', () => {
    let controller: TenantController;
    let service: TenantService;
    let tenant1: Tenant;
    let tenant2: Tenant;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TenantService,
                FilterService,
                getRepositoryMockConfig(Tenant),
                getEntityManagerMockConfig(),
            ],
            controllers: [TenantController],
        }).compile();

        controller = module.get<TenantController>(TenantController);
        service = module.get<TenantService>(TenantService);
        tenant1 = plainToClass(Tenant, {
            id: 1,
            name: 'Tenant holder 1',
            description: 'Tenant holder 1 description',
            createdAt: new Date(),
        });
        tenant2 = plainToClass(Tenant, {
            id: 2,
            name: 'Tenant holder 2',
            description: 'Tenant holder 2 description',
            createdAt: new Date(),
        });
    });

    it('should update an tenantItem-holder', async () => {
        const updateData: UpdateTenantDto = {
            name: 'Update tenantItem holder name to 1',
        };
        jest.spyOn(service, 'update').mockImplementation(
            (id: number, dto: UpdateTenantDto) => {
                expect(id).toBe(tenant1.id);
                tenant1.updatedAt = new Date();
                tenant1.createdAt = new Date();
                tenant1.name = dto.name;
                tenant1.description = dto.description && tenant1.description;

                return Promise.resolve(tenant1);
            },
        );

        expect(
            await controller.update(`${tenant1.id}`, {
                name: updateData.name,
            }),
        ).toBeInstanceOf(Tenant);
        expect(
            await controller.update(`${tenant1.id}`, {
                name: updateData.name,
            }),
        ).toMatchObject({
            ...tenant1,
            updatedAt: expect.any(Date),
            createdAt: expect.any(Date),
            name: updateData.name,
        });
    });

    it('should create new tenant holder', async () => {
        const data = {
            name: 'E-commerce',
            description: 'E-commerce description',
        };
        jest.spyOn(service, 'create').mockImplementation(() => {
            const createdObj = plainToClass(Tenant, { ...data, id: 1 });
            createdObj.createdAt = new Date();
            return Promise.resolve(createdObj);
        });

        expect(
            await controller.create(plainToClass(CreateTenantDto, data)),
        ).toMatchObject({
            ...plainToClass(Tenant, { ...data, id: 1 }),
            createdAt: expect.any(Date),
            tenantItems: expect.any(Collection),
            fromTenant: expect.any(Collection),
            toTenant: expect.any(Collection),
        });
    });

    it('should find a tenantItem by id', async () => {
        jest.spyOn(service, 'findOne').mockImplementation(id => {
            expect(id).toBe(tenant1.id);
            return Promise.resolve(tenant1);
        });

        expect(await controller.findOne(`${tenant1.id}`)).toEqual({
            ...tenant1,
            createdAt: expect.any(Date),
        });
    });

    it('should search tenantItem-holders', async () => {
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
                    id: QueryOrder.ASC,
                },
            },
        };

        const result = [tenant1, tenant2];

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
        const result = 'success';
        jest.spyOn(service, 'remove').mockImplementation(() => {
            return Promise.resolve(result);
        });
        expect(await controller.remove(`${tenant1.id}`)).toBe(result);
    });
});
