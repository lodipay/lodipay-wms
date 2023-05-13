import { Inventory } from '@/database/entities/inventory.entity';
import { EntityManager } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerMockConfig } from '../mock';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilterService, getEntityManagerMockConfig()],
    }).compile();

    service = module.get<FilterService>(FilterService);
    em = module.get<EntityManager>(EntityManager);
  });

  describe('validating limit parameter', () => {
    it('should set default value on negative number', async () => {
      jest.spyOn(em, 'findAndCount').mockResolvedValueOnce([[], 100]);

      expect(
        await service.search(Inventory, {
          limit: -10,
        }),
      ).toMatchObject({
        limit: 20,
        page: 1,
        total: 100,
        result: [],
        totalPage: 5,
      });
    });

    it('should set default value when the limit is not provided', async () => {
      jest.spyOn(em, 'findAndCount').mockResolvedValueOnce([[], 100]);

      expect(await service.search(Inventory, {})).toMatchObject({
        limit: 20,
        page: 1,
        total: 100,
        result: [],
        totalPage: 5,
      });
    });
  });

  describe('validating page parameter', () => {
    it('should set default value on negative number', async () => {
      jest.spyOn(em, 'findAndCount').mockResolvedValueOnce([[], 100]);

      expect(
        await service.search(Inventory, {
          page: -10,
        }),
      ).toMatchObject({
        limit: 20,
        page: 1,
        total: 100,
        result: [],
        totalPage: 5,
      });
    });

    it('should set default value when the page is not provided', async () => {
      jest.spyOn(em, 'findAndCount').mockResolvedValueOnce([[], 100]);

      expect(await service.search(Inventory, {})).toMatchObject({
        limit: 20,
        page: 1,
        total: 100,
        result: [],
        totalPage: 5,
      });
    });
  });
});
