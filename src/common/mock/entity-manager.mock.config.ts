import { EntityManager } from '@mikro-orm/core';
import { EntityManager as DriverEntityManager } from '@mikro-orm/postgresql';

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

export function getEntityManagerDriverMockConfig() {
    return {
        provide: DriverEntityManager,
        useFactory: jest.fn(() => ({
            flush: jest.fn(),
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn(),
            assign: jest.fn(),
            findAndCount: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: () => ({
                update: jest.fn(),
                execute: jest.fn(),
            }),
        })),
    };
}
