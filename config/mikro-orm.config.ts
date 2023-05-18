import { Options } from '@mikro-orm/core';
import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as dotenv from 'dotenv';
import { CustomNamingStrategy } from './naming.strategy';

dotenv.config();

const mikroOrmConfig: Options = {
  type: 'postgresql',
  host: process.env.WHS_DB_HOST,
  port: +process.env.WHS_DB_PORT,
  user: process.env.WHS_DB_USER,
  password: process.env.WHS_DB_PASSWORD,
  dbName: process.env.WHS_DB,
  entities: ['dist/src/**/*.entity.{js,ts}'],
  entitiesTs: ['src/**/*.entity.ts'],
  connect: process.env.ENVIRONMENT !== 'test',
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'dist/src/database/migrations',
    pathTs: 'src/database/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: false,
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
  },
  seeder: {
    path: 'dist/src/database/seeders', // path to the folder with seeders
    pathTs: 'src/database/seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    // defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },
  namingStrategy: CustomNamingStrategy,
};

export default mikroOrmConfig;
