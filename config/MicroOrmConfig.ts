import { Options } from '@mikro-orm/core';
import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { config } from 'dotenv';
import CONSTANTS from '../src/common/constants/constants.const';

const dbConfig = config({ path: '.env' }).parsed;

const MikroOrmConfig: Options = {
    type: 'postgresql',
    host: dbConfig.WHS_DB_HOST,
    port: +dbConfig.WHS_DB_PORT,
    user: dbConfig.WHS_DB_USER,
    password: dbConfig.WHS_DB_PASSWORD,
    dbName: dbConfig.WHS_DB,
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
        // snapshot: true, // save snapshot when creating new migrations
        emit: 'ts', // migration generation mode
        generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
    },
};

export default MikroOrmConfig;
