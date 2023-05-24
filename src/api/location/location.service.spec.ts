import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import {
    getEntityManagerMockConfig,
    getRepositoryMockConfig,
} from '../../common/mock';
import { Location } from '../../database/entities/location.entity';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationService } from './location.service';

describe('LocationService', () => {
    let service: LocationService;
    let em: EntityManager;
    let repository: EntityRepository<Location>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocationService,
                getEntityManagerMockConfig(),
                getRepositoryMockConfig(Location),
                getRepositoryMockConfig(Warehouse),
            ],
        }).compile();

        service = module.get<LocationService>(LocationService);
        em = module.get<EntityManager>(EntityManager);
        repository = module.get<EntityRepository<Location>>(
            getRepositoryToken(Location),
        );
    });

    it('should create new location', async () => {
        const warehouse = new Warehouse('WH1', 'WH1 description');
        warehouse.id = 1;

        const dto: CreateLocationDto = {
            code: 'location-1-code',
            description: 'location description',
            warehouseId: warehouse.id,
        };
        const result = new Location(dto.code, warehouse, dto.description);

        jest.spyOn(repository, 'upsert').mockImplementation((obj: Location) => {
            result.id = obj.id = 1;

            return Promise.resolve(result);
        });

        expect(await service.create(dto)).toStrictEqual(result);
    });

    it('should find all locations', async () => {
        const result = [
            new Location(
                'location-1-code',
                new Warehouse('WH1', 'WH1 description'),
                'location1 description',
            ),
            new Location(
                'location-2-code',
                new Warehouse('WH1', 'WH1 description'),
                'location2 description',
            ),
        ];

        jest.spyOn(repository, 'findAll').mockImplementation(() => {
            return Promise.resolve(result);
        });

        expect(await service.findAll()).toStrictEqual(result);
    });

    it('should find one location', async () => {
        const result = new Location(
            'location-1-code',
            new Warehouse('WH1', 'WH1 description'),
            'location description',
        );
        result.id = 1;

        jest.spyOn(repository, 'findOne').mockImplementation((options: any) => {
            expect(options.id).toBe(result.id);
            return Promise.resolve(result);
        });

        expect(await service.findOne(1)).toStrictEqual(result);
    });

    it('should update location', async () => {
        const result: Location = {
            id: 1,
            code: 'location-1-code',
            warehouse: new Warehouse('WH1', 'WH1 description'),
            description: 'location-1 description',
        };
        jest.spyOn(service, 'findOne').mockImplementation(() => {
            const locationData = new Location(
                result.code,
                result.warehouse,
                result.description,
            );
            locationData.id = result.id;
            return Promise.resolve(locationData);
        });
        jest.spyOn(em, 'assign').mockImplementation(
            (obj1: Location, obj2: Location) => {
                const mergedObj = Object.assign({}, obj1, obj2);
                obj1.id = mergedObj.id;
                obj1.code = mergedObj.code;
                obj1.description = mergedObj.description;
                obj1.warehouse = mergedObj.warehouse;
                return obj1;
            },
        );
        const updatedResult = new Location(
            'location-1-updated-code',
            new Warehouse('WH1', 'WH1 description'),
            'location-1 updated description',
        );
        updatedResult.id = result.id;
        updatedResult.warehouse.createdAt = result.warehouse.createdAt;
        expect(
            await service.update(result.id, {
                code: updatedResult.code,
                description: updatedResult.description,
            }),
        ).toStrictEqual(updatedResult);
    });

    it('remove', async () => {
        const result = new Location(
            'location-1-code',
            new Warehouse('WH1', 'WH1 description'),
            'location description',
        );
        result.id = 1;

        jest.spyOn(repository, 'findOne').mockImplementation((options: any) => {
            expect(options.id).toBe(result.id);
            return Promise.resolve(result);
        });

        expect(await service.remove(1)).toStrictEqual('deleted');
    });
});
