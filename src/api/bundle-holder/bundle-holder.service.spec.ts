import { Collection, EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '../../common/mock';
import { getTestingModule } from '../../common/mock/testing.module.mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { BundleHolder } from '../../database/entities/bundle-holder.entity';
import { BundleHolderService } from './bundle-holder.service';
import { UpdateBundleHolderDto } from './dto/update-bundle-holder.dto';

describe('BundleHolderService', () => {
  let service: BundleHolderService;
  let bundleHolderRepo: EntityRepository<BundleHolder>;
  let bundleHolder1: BundleHolder;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await getTestingModule(
      [
        BundleHolderService,
        FilterService,
        getEntityManagerMockConfig(),
        getRepositoryMockConfig(BundleHolder),
      ],
      [],
    );

    service = module.get<BundleHolderService>(BundleHolderService);
    bundleHolderRepo = module.get<EntityRepository<BundleHolder>>(
      getRepositoryToken(BundleHolder),
    );
    em = module.get<EntityManager>(EntityManager);
    filterService = module.get<FilterService>(FilterService);

    bundleHolder1 = plainToClass(BundleHolder, {
      name: 'Bundle holder 1',
      description: 'Bundle holder 1 description',
    });
    bundleHolder2 = plainToClass(BundleHolder, {
      name: 'Bundle holder 2',
      description: 'Bundle holder 2 description',
    });
  });

  it('should create a bundle holder', async () => {
    jest
      .spyOn(em, 'persistAndFlush')
      .mockImplementation((obj: BundleHolder) => {
        obj.id = bundleHolder1.id = 1;
        obj.createdAt = new Date();
        return Promise.resolve();
      });

    expect(
      await service.create({
        name: bundleHolder1.name,
        description: bundleHolder1.description,
      }),
    ).toBeInstanceOf(BundleHolder);

    expect(
      await service.create({
        name: bundleHolder1.name,
        description: bundleHolder1.description,
      }),
    ).toMatchObject({
      ...bundleHolder1,
      createdAt: expect.any(Date),
      bundles: expect.any(Collection<BundleHolder>),
    });
  });

  it('should find bundle holder by id', async () => {
    bundleHolder1.id = 1;
    jest
      .spyOn(bundleHolderRepo, 'findOne')
      .mockImplementation((id: number): any => {
        expect(id).toBe(bundleHolder1.id);
        return Promise.resolve(bundleHolder1);
      });

    expect(await service.findOne(bundleHolder1.id)).toBeInstanceOf(
      BundleHolder,
    );
    expect(await service.findOne(bundleHolder1.id)).toEqual(bundleHolder1);
  });

  describe('update', () => {
    it('should throw error when bundle holder not found', async () => {
      const searchId = 123;
      jest
        .spyOn(bundleHolderRepo, 'findOne')
        .mockImplementation((id: number): any => {
          expect(id).toBe(searchId);

          return Promise.resolve(null);
        });

      await expect(
        service.update(searchId, {
          name: bundleHolder1.name,
          description: bundleHolder1.description,
        }),
      ).rejects.toThrow(InvalidArgumentException);
    });

    it('should update bundle holder', async () => {
      const updateData = {
        id: 1,
        name: 'Updated name',
        description: 'Updated description',
      };

      jest.spyOn(bundleHolderRepo, 'findOne').mockImplementation((id): any => {
        expect(id).toBe(updateData.id);
        bundleHolder1.id = updateData.id;
        bundleHolder1.createdAt = new Date();
        return Promise.resolve(bundleHolder1);
      });

      jest
        .spyOn(em, 'assign')
        .mockImplementation(
          (obj1: BundleHolder, obj2: UpdateBundleHolderDto) => {
            obj1.name = obj2.name || obj2.name;
            obj1.description = obj2.description || obj1.description;
            return obj1;
          },
        );

      jest.spyOn(em, 'persistAndFlush').mockImplementation(() => {
        return Promise.resolve();
      });
      bundleHolder1.updatedAt = new Date();
      bundleHolder1.name = updateData.name;
      bundleHolder1.description = updateData.description;

      expect(
        await service.update(updateData.id, {
          name: updateData.name,
          description: updateData.description,
        }),
      ).toBeInstanceOf(BundleHolder);
      expect(
        await service.update(updateData.id, {
          name: updateData.name,
          description: updateData.description,
        }),
      ).toEqual(bundleHolder1);
    });
  });

  it('should remove', async () => {
    bundleHolder1.id = 1;
    jest.spyOn(service, 'findOne').mockImplementation((id: number): any => {
      expect(id).toBe(bundleHolder1.id);
      return Promise.resolve(bundleHolder1);
    });

    expect(await service.remove(1)).toStrictEqual('success');
  });
});
