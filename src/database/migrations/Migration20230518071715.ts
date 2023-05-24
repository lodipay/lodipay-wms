import { Migration } from '@mikro-orm/migrations';

export class Migration20230518071715 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "t_lock" ("id" serial primary key, "c_reason" varchar(255) not null, "c_active_from" timestamptz(0) null, "c_active_to" timestamptz(0) null);',
        );

        this.addSql(
            'create table "t_warehouse" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_name" varchar(255) not null, "c_description" varchar(255) not null);',
        );
        this.addSql(
            'alter table "t_warehouse" add constraint "t_warehouse_c_name_unique" unique ("c_name");',
        );

        this.addSql(
            'create table "t_location" ("id" serial primary key, "c_code" varchar(255) not null, "c_description" varchar(255) null, "c_warehouse_id" int not null);',
        );
        this.addSql(
            'alter table "t_location" add constraint "t_location_c_code_unique" unique ("c_code");',
        );

        this.addSql(
            'create table "t_destination" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_name" varchar(255) not null, "c_description" varchar(255) not null, "c_warehouse_id" int null);',
        );
        this.addSql(
            'alter table "t_destination" add constraint "t_destination_c_warehouse_id_unique" unique ("c_warehouse_id");',
        );

        this.addSql(
            'create table "t_order" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_name" varchar(255) not null, "c_description" varchar(255) null, "c_created_by" varchar(255) null, "c_status" text check ("c_status" in (\'NEW\', \'READY\', \'DELIVERING\', \'DELIVERED\', \'DONE\', \'CANCELED\', \'RETURNED\')) not null default \'NEW\', "c_from_id" int not null, "c_to_id" int not null);',
        );

        this.addSql(
            'create table "t_order_item" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_description" varchar(255) null, "c_inventory_amount" int not null, "c_order_id" int not null);',
        );

        this.addSql(
            'create table "t_inventory" ("id" serial primary key, "c_sku" varchar(255) not null, "c_name" varchar(255) not null, "c_description" varchar(255) null, "c_quantity" int not null, "c_expire_date" timestamptz(0) null, "c_batch_code" varchar(255) not null, "c_weight" int null, "c_width" int null, "c_height" int null, "c_depth" int null, "c_volume" int null, "c_parent_id" int null, "c_order_item_id" int null);',
        );
        this.addSql(
            'alter table "t_inventory" add constraint "t_inventory_c_sku_unique" unique ("c_sku");',
        );

        this.addSql(
            'alter table "t_location" add constraint "t_location_c_warehouse_id_foreign" foreign key ("c_warehouse_id") references "t_warehouse" ("id") on update cascade;',
        );

        this.addSql(
            'alter table "t_destination" add constraint "t_destination_c_warehouse_id_foreign" foreign key ("c_warehouse_id") references "t_warehouse" ("id") on update cascade on delete set null;',
        );

        this.addSql(
            'alter table "t_order" add constraint "t_order_c_from_id_foreign" foreign key ("c_from_id") references "t_destination" ("id") on update cascade;',
        );
        this.addSql(
            'alter table "t_order" add constraint "t_order_c_to_id_foreign" foreign key ("c_to_id") references "t_destination" ("id") on update cascade;',
        );

        this.addSql(
            'alter table "t_order_item" add constraint "t_order_item_c_order_id_foreign" foreign key ("c_order_id") references "t_order" ("id") on update cascade;',
        );

        this.addSql(
            'alter table "t_inventory" add constraint "t_inventory_c_parent_id_foreign" foreign key ("c_parent_id") references "t_inventory" ("id") on update cascade on delete set null;',
        );
        this.addSql(
            'alter table "t_inventory" add constraint "t_inventory_c_order_item_id_foreign" foreign key ("c_order_item_id") references "t_order_item" ("id") on update cascade on delete set null;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_location" drop constraint "t_location_c_warehouse_id_foreign";',
        );

        this.addSql(
            'alter table "t_destination" drop constraint "t_destination_c_warehouse_id_foreign";',
        );

        this.addSql(
            'alter table "t_order" drop constraint "t_order_c_from_id_foreign";',
        );

        this.addSql(
            'alter table "t_order" drop constraint "t_order_c_to_id_foreign";',
        );

        this.addSql(
            'alter table "t_order_item" drop constraint "t_order_item_c_order_id_foreign";',
        );

        this.addSql(
            'alter table "t_inventory" drop constraint "t_inventory_c_order_item_id_foreign";',
        );

        this.addSql(
            'alter table "t_inventory" drop constraint "t_inventory_c_parent_id_foreign";',
        );

        this.addSql('drop table if exists "t_lock" cascade;');

        this.addSql('drop table if exists "t_warehouse" cascade;');

        this.addSql('drop table if exists "t_location" cascade;');

        this.addSql('drop table if exists "t_destination" cascade;');

        this.addSql('drop table if exists "t_order" cascade;');

        this.addSql('drop table if exists "t_order_item" cascade;');

        this.addSql('drop table if exists "t_inventory" cascade;');
    }
}
