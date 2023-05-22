import { MikroORM } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import mikroOrmTestConfig from '../../../config/mikro-orm.test.config';

export const getTestingModule = async (module: {
  providers: any[];
  imports?: any[];
  controllers?: any[];
}): Promise<TestingModule> => {
  const moduleProperties: {
    providers: any[];
    controllers?: any[];
    imports?: any[];
  } = {
    providers: [],
    controllers: [],
    imports: [],
  };
  moduleProperties.providers = module.providers;

  if (module.controllers?.length) {
    moduleProperties.controllers = module.controllers;
  }
  if (module.imports?.length) {
    moduleProperties.imports = module.imports;
  }

  return Test.createTestingModule({
    providers: [
      ...moduleProperties.providers,
      {
        provide: await MikroORM.init(mikroOrmTestConfig),
      },
    ],
    controllers: [...moduleProperties.controllers],
    imports: [...moduleProperties.imports],
  }).compile();
};
