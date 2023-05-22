import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import mikroOrmTestConfig from '../../../config/mikro-orm.test.config';

export const getTestingModule = (
  providers: any[],
  imports: any[] = [],
): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [MikroOrmModule.forRoot(mikroOrmTestConfig), ...imports],
    providers,
  }).compile();
};
