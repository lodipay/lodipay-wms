import { MikroORM } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import mikroOrmTestConfig from '../../../config/mikro-orm.test.config';
interface NamedArguments {
  providers: any[];
  controllers?: any[];
  imports?: any[];
}
export const getTestingModule = async ({
  providers = [],
  imports = [],
  controllers = [],
}: NamedArguments): Promise<TestingModule> => {
  return Test.createTestingModule({
    providers: [
      ...providers,
      {
        provide: await MikroORM.init(mikroOrmTestConfig),
      },
    ],
    controllers,
    imports,
  }).compile();
};
