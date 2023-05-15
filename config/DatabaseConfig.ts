import {
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import mikroOrmConfig from './microOrmConfig';

export const DB_CONNECTION = 'default';

const mikroConfig = mikroOrmConfig;

@Injectable()
export default class DatabaseConfig implements MikroOrmOptionsFactory {
  createMikroOrmOptions(): MikroOrmModuleOptions {
    return {
      name: DB_CONNECTION,
      debug: process.env.ENVIRONMENT === process.env.ENVIRONMENT_DEV,
      autoLoadEntities: false,
      ...mikroConfig,
    };
  }
}
