import { EntityManager } from '@mikro-orm/core';

export function getEntityManagerMockConfig() {
  return {
    provide: EntityManager,
    useFactory: jest.fn(() => ({
      flush: jest.fn(),
      persistAndFlush: jest.fn(),
      removeAndFlush: jest.fn(),
      assign: jest.fn(),
      findAndCount: jest.fn(),
    })),
  };
}
