import { Migration } from '@mikro-orm/migrations';

export class Migration20230509131152 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "inventory" ("id" serial primary key, "sku" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "quantity" int not null, "expire_date" timestamptz(0) null, "batch_code" varchar(255) not null, "weight" int null, "width" int null, "height" int null, "depth" int null, "volume" int null, "parent_id" int null);',
    );
    this.addSql(
      'alter table "inventory" add constraint "inventory_sku_unique" unique ("sku");',
    );

    this.addSql(
      'alter table "inventory" add constraint "inventory_parent_id_foreign" foreign key ("parent_id") references "inventory" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "inventory" drop constraint "inventory_parent_id_foreign";',
    );

    this.addSql('drop table if exists "inventory" cascade;');
  }
}
