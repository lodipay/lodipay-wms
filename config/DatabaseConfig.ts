import { TSMigrationGenerator } from '@mikro-orm/migrations';
import {
    MikroOrmModuleOptions,
    MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import CONSTANTS from '../src/common/constants/constants.const';

export const DB_CONNECTION = 'default';

@Injectable()
export default class DatabaseConfig implements MikroOrmOptionsFactory {
    createMikroOrmOptions(): MikroOrmModuleOptions {
        return {
            name: DB_CONNECTION,
            type: 'postgresql',
            host: process.env.WHS_DB_HOST,
            port: +process.env.WHS_DB_PORT,
            user: process.env.WHS_DB_USER,
            password: process.env.WHS_DB_PASSWORD,
            dbName: process.env.WHS_DB,
            debug: process.env.ENVIRONMENT !== process.env.ENVIRONMENT_PROD,
            entities: CONSTANTS.entities,
            entitiesTs: CONSTANTS.entitiesTs,
            allowGlobalContext: true,
            // autoLoadEntities: true,
            migrations: {
                tableName: 'micro_orm_migrations',
                path: 'dist/database/migrations',
                pathTs: '../src/database/migrations',
                glob: '!(*.d).{js,ts}',
                transactional: true,
                disableForeignKeys: true,
                allOrNothing: true, // wrap all migrations in master transaction
                dropTables: false, // allow to disable table dropping
                safe: true, // allow to disable table and column dropping
                snapshot: true, // save snapshot when creating new migrations
                emit: 'ts', // migration generation mode
                generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
            },
        };
    }
}
