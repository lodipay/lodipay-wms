import { Options } from '@mikro-orm/core';
import { TSMigrationGenerator } from '@mikro-orm/migrations';
import CONSTANTS from '../src/common/constants/constants.const';
import * as dotenv from 'dotenv';

dotenv.config();

const mikroOrmConfig: Options = {
  type: 'postgresql',
  host: process.env.WHS_DB_HOST,
  port: +process.env.WHS_DB_PORT,
  user: process.env.WHS_DB_USER,
  password: process.env.WHS_DB_PASSWORD,
  dbName: process.env.WHS_DB,
  entities: CONSTANTS.entities,
  migrations: {
    tableName: 'micro_orm_migrations',
    path: 'src/database/migrations',
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
};

export default mikroOrmConfig;
