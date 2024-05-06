import { MikroORM } from '@mikro-orm/core';
import { EntityGenerator } from '@mikro-orm/entity-generator';

(async () => {
  const orm = await MikroORM.init({
    discovery: {
      // we need to disable validation for no entities
      warnWhenNoEntities: false,
    },
    dbName: 'greater_wms',
    host: 'postgres',
    port: 5432,
    user: 'admin',
    password: 'password',
    extensions: [EntityGenerator],
    entityGenerator: {
        bidirectionalRelations: true,
        identifiedReferences: true,
    },
    type : 'postgresql',
    // ...
  });
  const generator = orm.getEntityGenerator();
  const dump = await generator.generate({
    save: true,
    baseDir: process.cwd() + '/my-entities',
  });
  console.log(dump);
  await orm.close(true);
})();