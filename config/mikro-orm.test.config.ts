import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { CustomNamingStrategy } from './naming.strategy';

const mikroOrmTestConfig: Options = {
    type: 'postgresql',
    dbName: 'test',
    entities: ['dist/src/database/entities/*.entity.{js,ts}'],
    entitiesTs: ['src/database/entities/*.entity.ts'],
    connect: false,
    metadataProvider: TsMorphMetadataProvider,
    namingStrategy: CustomNamingStrategy,
};

export default mikroOrmTestConfig;
