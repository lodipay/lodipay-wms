import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const mikroOrmConfig: Options = {
  type: 'postgresql',
  dbName: 'test',
  entitiesTs: ['src/database/entities/*.entity.ts'],
  connect: false,
  metadataProvider: TsMorphMetadataProvider,
};

export default mikroOrmConfig;
