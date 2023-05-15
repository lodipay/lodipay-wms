import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Test, TestingModule } from '@nestjs/testing';

export const getTestingModule = (providers: any[]): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [
      MikroOrmModule.forRoot({
        name: 'default',
        type: 'postgresql',
        autoLoadEntities: false,
        connect: false,
        dbName: 'test',
        // entities: ['dist/src/database/entities/*.entity.{js,ts}'],
        entitiesTs: ['src/database/entities/*.entity.ts'],
        metadataProvider: TsMorphMetadataProvider,
      }),
    ],
    providers,
  }).compile();
};
