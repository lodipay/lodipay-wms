import { Migration } from '@mikro-orm/migrations';

export class Migration20230515052957 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if exists "inventory_lock" cascade;');

    this.addSql('drop table if exists "warehouse_inventory" cascade;');

    this.addSql(
      'alter table "order_item" drop constraint "order_item_inventory_id_foreign";',
    );

    this.addSql(
      'alter table "order_item" drop constraint "order_item_inventory_id_unique";',
    );
    this.addSql('alter table "order_item" drop column "inventory_id";');

    this.addSql(
      'alter table "inventory" drop constraint "inventory_order_item_id_unique";',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "inventory_lock" ("id" serial primary key, "created_at" timestamptz not null default null, "updated_at" timestamptz null default null, "created_by" varchar null default null, "description" varchar null default null, "amount" int4 not null default null, "warehouse_id" int4 not null default null, "lock_id" int4 not null default null, "inventory_id" int4 not null default null, "start_date" timestamptz not null default null, "end_date" timestamptz not null default null);',
    );

    this.addSql(
      'create table "warehouse_inventory" ("id" serial primary key, "created_at" timestamptz not null default null, "updated_at" timestamptz null default null, "amount" int4 not null default null, "description" varchar not null default null, "created_by" varchar not null default null, "warehouse_id" int4 not null default null, "inventory_id" int4 not null default null, "received_at" timestamptz null default null);',
    );

    this.addSql(
      'alter table "inventory_lock" add constraint "inventory_lock_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade on delete no action;',
    );
    this.addSql(
      'alter table "inventory_lock" add constraint "inventory_lock_lock_id_foreign" foreign key ("lock_id") references "lock" ("id") on update cascade on delete no action;',
    );
    this.addSql(
      'alter table "inventory_lock" add constraint "inventory_lock_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade on delete no action;',
    );

    this.addSql(
      'alter table "warehouse_inventory" add constraint "warehouse_inventory_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade on delete no action;',
    );
    this.addSql(
      'alter table "warehouse_inventory" add constraint "warehouse_inventory_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade on delete no action;',
    );

    this.addSql(
      'alter table "inventory" add constraint "inventory_order_item_id_unique" unique ("order_item_id");',
    );

    this.addSql(
      'alter table "order_item" add column "inventory_id" int4 not null default null;',
    );
    this.addSql(
      'alter table "order_item" add constraint "order_item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update set null on delete no action;',
    );
    this.addSql(
      'alter table "order_item" add constraint "order_item_inventory_id_unique" unique ("inventory_id");',
    );
  }
}
