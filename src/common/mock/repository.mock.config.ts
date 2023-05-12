import { getRepositoryToken } from '@mikro-orm/nestjs';

export function getRepositoryMockConfig<T>(
  entityClass: new (...args: any[]) => T,
) {
  return {
    provide: getRepositoryToken(entityClass),
    useFactory: jest.fn(() => ({
      findAll: jest.fn(),
      findOne: jest.fn(),
      upsert: jest.fn(),
    })),
  };
}
