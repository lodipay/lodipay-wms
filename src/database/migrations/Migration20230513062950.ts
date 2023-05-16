import { Migration } from '@mikro-orm/migrations';

export class Migration20230513062950 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "order_item" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "description" varchar(255) null, "inventory_amount" int not null, "order_id" int not null, "inventory_id" int not null);',
    );
    this.addSql(
      'alter table "order_item" add constraint "order_item_inventory_id_unique" unique ("inventory_id");',
    );

    this.addSql(
      'alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "order_item" add constraint "order_item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "destination" drop constraint "destination_warehouse_id_foreign";',
    );

    this.addSql(
      'alter table "warehouse" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );

    this.addSql(
      'alter table "destination" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "destination" alter column "warehouse_id" type int using ("warehouse_id"::int);',
    );
    this.addSql(
      'alter table "destination" alter column "warehouse_id" drop not null;',
    );
    this.addSql(
      'alter table "destination" add constraint "destination_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "order" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );

    this.addSql('alter table "inventory" add column "order_item_id" int null;');
    this.addSql(
      'alter table "inventory" add constraint "inventory_order_item_id_foreign" foreign key ("order_item_id") references "order_item" ("id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "inventory" add constraint "inventory_order_item_id_unique" unique ("order_item_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "inventory" drop constraint "inventory_order_item_id_foreign";',
    );

    this.addSql('drop table if exists "order_item" cascade;');

    this.addSql(
      'alter table "destination" drop constraint "destination_warehouse_id_foreign";',
    );

    this.addSql(
      'alter table "destination" alter column "created_at" type varchar using ("created_at"::varchar);',
    );
    this.addSql(
      'alter table "destination" alter column "warehouse_id" type int4 using ("warehouse_id"::int4);',
    );
    this.addSql(
      'alter table "destination" alter column "warehouse_id" set not null;',
    );
    this.addSql(
      'alter table "destination" add constraint "destination_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade on delete no action;',
    );

    this.addSql(
      'alter table "inventory" drop constraint "inventory_order_item_id_unique";',
    );
    this.addSql('alter table "inventory" drop column "order_item_id";');

    this.addSql(
      'alter table "order" alter column "created_at" type varchar using ("created_at"::varchar);',
    );

    this.addSql(
      'alter table "warehouse" alter column "created_at" type varchar using ("created_at"::varchar);',
    );
  }
}
