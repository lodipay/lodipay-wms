import {
  MikroOrmModule,
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Test, TestingModule } from '@nestjs/testing';

export default class TestDatabaseConfig implements MikroOrmOptionsFactory {
  createMikroOrmOptions(): MikroOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgresql',
      debug: false,
      autoLoadEntities: false,
      connect: false,
      dbName: 'test',
      entities: ['dist/src/**/*.entity.{js,ts}'],
      entitiesTs: ['src/**/*.entity.ts'],
      metadataProvider: TsMorphMetadataProvider,
    };
  }
}

export const getTestingModule = (providers: any[]): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [
      MikroOrmModule.forRootAsync({
        useClass: TestDatabaseConfig,
      }),
    ],
    providers,
  }).compile();
};
