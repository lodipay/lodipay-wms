import { Migration } from '@mikro-orm/migrations';

export class Migration20230602065627 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "t_inventory" drop constraint "t_inventory_c_bundle_id_foreign";',
        );

        this.addSql(
            'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
        );

        this.addSql(
            'create table "t_tenant" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_name" varchar(255) not null, "c_description" varchar(255) null);',
        );

        this.addSql(
            'create table "t_tenant_item" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_description" varchar(255) not null, "c_quantity" int not null default 0, "c_tenant_id" int not null, "c_warehouse_id" int not null, "c_inventory_id" int not null);',
        );

        this.addSql(
            'alter table "t_tenant_item" add constraint "t_tenant_item_c_tenant_id_foreign" foreign key ("c_tenant_id") references "t_tenant" ("id") on update cascade;',
        );
        this.addSql(
            'alter table "t_tenant_item" add constraint "t_tenant_item_c_warehouse_id_foreign" foreign key ("c_warehouse_id") references "t_warehouse" ("id") on update cascade;',
        );
        this.addSql(
            'alter table "t_tenant_item" add constraint "t_tenant_item_c_inventory_id_foreign" foreign key ("c_inventory_id") references "t_inventory" ("id") on update cascade;',
        );

        this.addSql('drop table if exists "t_bundle" cascade;');

        this.addSql('drop table if exists "t_bundle_holder" cascade;');

        this.addSql('drop table if exists "t_warehouse_inventory" cascade;');

        this.addSql('alter table "t_inventory" drop column "c_bundle_id";');

        this.addSql(
            'alter table "t_transfer_item" add column "c_from_tenant_id" int null, add column "c_to_tenant_id" int not null;',
        );
        this.addSql(
            'alter table "t_transfer_item" add constraint "t_transfer_item_c_from_tenant_id_foreign" foreign key ("c_from_tenant_id") references "t_tenant" ("id") on update cascade on delete set null;',
        );
        this.addSql(
            'alter table "t_transfer_item" add constraint "t_transfer_item_c_to_tenant_id_foreign" foreign key ("c_to_tenant_id") references "t_tenant" ("id") on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_tenant_item" drop constraint "t_tenant_item_c_tenant_id_foreign";',
        );

        this.addSql(
            'alter table "t_transfer_item" drop constraint "t_transfer_item_c_from_tenant_id_foreign";',
        );

        this.addSql(
            'alter table "t_transfer_item" drop constraint "t_transfer_item_c_to_tenant_id_foreign";',
        );

        this.addSql(
            'create table "t_bundle" ("id" serial primary key, "c_created_at" timestamptz not null default null, "c_updated_at" timestamptz null default null, "c_description" varchar not null default null, "c_active_from" timestamptz null default null, "c_active_to" timestamptz null default null, "c_bundle_holder_id" int4 not null default null, "c_bundle_quantity" int4 not null default null);',
        );

        this.addSql(
            'create table "t_bundle_holder" ("id" serial primary key, "c_created_at" timestamptz not null default null, "c_updated_at" timestamptz null default null, "c_name" varchar not null default null, "c_description" varchar null default null);',
        );

        this.addSql(
            'create table "t_warehouse_inventory" ("id" serial primary key, "c_created_at" timestamptz not null default null, "c_updated_at" timestamptz null default null, "c_warehouse_id" int4 not null default null, "c_inventory_id" int4 not null default null, "c_quantity" int4 not null default null);',
        );

        this.addSql(
            'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update cascade on delete no action;',
        );

        this.addSql(
            'alter table "t_warehouse_inventory" add constraint "t_warehouse_inventory_c_inventory_id_foreign" foreign key ("c_inventory_id") references "t_inventory" ("id") on update cascade on delete no action;',
        );
        this.addSql(
            'alter table "t_warehouse_inventory" add constraint "t_warehouse_inventory_c_warehouse_id_foreign" foreign key ("c_warehouse_id") references "t_warehouse" ("id") on update cascade on delete no action;',
        );

        this.addSql('drop table if exists "t_tenant" cascade;');

        this.addSql('drop table if exists "t_tenant_item" cascade;');

        this.addSql(
            'alter table "t_inventory" add column "c_bundle_id" int4 null default null;',
        );
        this.addSql(
            'alter table "t_inventory" add constraint "t_inventory_c_bundle_id_foreign" foreign key ("c_bundle_id") references "t_bundle" ("id") on update cascade on delete set null;',
        );

        this.addSql(
            'alter table "t_transfer_item" drop column "c_from_tenant_id";',
        );
        this.addSql(
            'alter table "t_transfer_item" drop column "c_to_tenant_id";',
        );
    }
}
