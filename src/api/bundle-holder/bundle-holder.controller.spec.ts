import { Collection, QueryOrder } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { PaginatedDto } from '../../common/dto/paginated.dto';
import {
  getEntityManagerMockConfig,
  getRepositoryMockConfig,
} from '../../common/mock';
import { FilterService } from '../../common/module/filter/filter.service';
import { BundleHolder } from '../../database/entities/bundle-holder.entity';
import { BundleHolderController } from './bundle-holder.controller';
import { BundleHolderService } from './bundle-holder.service';
import { CreateBundleHolderDto } from './dto/create-bundle-holder.dto';
import { UpdateBundleHolderDto } from './dto/update-bundle-holder.dto';

describe('BundleHolderController', () => {
  let controller: BundleHolderController;
  let service: BundleHolderService;
  let bundleHolder1: BundleHolder;
  let bundleHolder2: BundleHolder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BundleHolderController],
      providers: [
        BundleHolderService,
        FilterService,
        getRepositoryMockConfig(BundleHolder),
        getEntityManagerMockConfig(),
      ],
    }).compile();

    controller = module.get<BundleHolderController>(BundleHolderController);
    service = module.get<BundleHolderService>(BundleHolderService);
    bundleHolder1 = plainToClass(BundleHolder, {
      id: 1,
      name: 'Bundle holder 1',
      description: 'Bundle holder 1 description',
      createdAt: new Date(),
    });
    bundleHolder1 = plainToClass(BundleHolder, {
      id: 2,
      name: 'Bundle holder 2',
      description: 'Bundle holder 2 description',
      createdAt: new Date(),
    });
  });

  it('should update an bundle-holder', async () => {
    const updateData = {
      name: 'Update bundle holder name to 1',
    };
    jest
      .spyOn(service, 'update')
      .mockImplementation((id: number, dto: UpdateBundleHolderDto) => {
        expect(id).toBe(bundleHolder1.id);
        bundleHolder1.updatedAt = new Date();
        bundleHolder1.createdAt = new Date();
        bundleHolder1.name = dto.name;
        bundleHolder1.description =
          dto.description && bundleHolder1.description;

        return Promise.resolve(bundleHolder1);
      });

    expect(
      await controller.update(`${bundleHolder1.id}`, { name: updateData.name }),
    ).toBeInstanceOf(BundleHolder);
    expect(
      await controller.update(`${bundleHolder1.id}`, { name: updateData.name }),
    ).toMatchObject({
      ...bundleHolder1,
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
      name: updateData.name,
    });
  });

  it('should create new bundle holder', async () => {
    const data = {
      name: 'E-commerce',
      description: 'E-commerce description',
    };
    jest.spyOn(service, 'create').mockImplementation(() => {
      const createdObj = plainToClass(BundleHolder, { ...data, id: 1 });
      createdObj.createdAt = new Date();
      return Promise.resolve(createdObj);
    });

    expect(
      await controller.create(plainToClass(CreateBundleHolderDto, data)),
    ).toMatchObject({
      ...plainToClass(BundleHolder, { ...data, id: 1 }),
      createdAt: expect.any(Date),
      bundles: expect.any(Collection),
    });
  });

  it('should find a bundle by id', async () => {
    jest.spyOn(service, 'findOne').mockImplementation(id => {
      expect(id).toBe(bundleHolder1.id);
      return Promise.resolve(bundleHolder1);
    });

    expect(await controller.findOne(`${bundleHolder1.id}`)).toEqual({
      ...bundleHolder1,
      createdAt: expect.any(Date),
    });
  });

  it('should search bundle-holders', async () => {
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

    const result = [bundleHolder1, bundleHolder2];

    jest.spyOn(service, 'search').mockImplementation(filterDto => {
      expect(filterDto).toStrictEqual(query);
      const paginatedDto = new PaginatedDto();
      paginatedDto.result = result;
      paginatedDto.page = filterDto.page;
      paginatedDto.limit = filterDto.limit;
      paginatedDto.total = 100;
      paginatedDto.totalPage = 10;

      return Promise.resolve(paginatedDto);
    });

    const paginatedDto = new PaginatedDto();
    paginatedDto.result = result;
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
    expect(await controller.remove(`${bundleHolder1.id}`)).toBe(result);
  });
});
