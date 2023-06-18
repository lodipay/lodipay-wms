import { Migration } from '@mikro-orm/migrations';

export class Migration20230530042658 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "t_order_item" drop constraint "t_order_item_c_order_id_foreign";',
        );

        this.addSql(
            'alter table "t_inventory" drop constraint "t_inventory_c_order_item_id_foreign";',
        );

        this.addSql(
            "create table \"t_transfer\" (\"id\" serial primary key, \"c_created_at\" timestamptz(0) not null, \"c_updated_at\" timestamptz(0) null, \"c_name\" varchar(255) not null, \"c_description\" varchar(255) null, \"c_created_by\" varchar(255) null, \"c_status\" text check (\"c_status\" in ('NEW', 'ACTIVE', 'INACTIVE', 'PACKING', 'PACKED', 'CANCELLED', 'DELIVERING', 'DELIVERED', 'RETURNING', 'RETURNED', 'RECEIVING', 'DONE')) not null default 'NEW', \"c_from_id\" int not null, \"c_to_id\" int not null);",
        );

        this.addSql(
            'create table "t_transfer_item" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_description" varchar(255) null, "c_inventory_amount" int not null, "c_transfered_status" varchar(255) null, "c_transfer_id" int not null, "c_inventory_id" int not null);',
        );

        this.addSql(
            'alter table "t_transfer" add constraint "t_transfer_c_from_id_foreign" foreign key ("c_from_id") references "t_destination" ("id") on update cascade;',
        );
        this.addSql(
            'alter table "t_transfer" add constraint "t_transfer_c_to_id_foreign" foreign key ("c_to_id") references "t_destination" ("id") on update cascade;',
        );

        this.addSql(
            'alter table "t_transfer_item" add constraint "t_transfer_item_c_transfer_id_foreign" foreign key ("c_transfer_id") references "t_transfer" ("id") on update cascade;',
        );
        this.addSql(
            'alter table "t_transfer_item" add constraint "t_transfer_item_c_inventory_id_foreign" foreign key ("c_inventory_id") references "t_inventory" ("id") on update cascade;',
        );

        this.addSql('drop table if exists "t_order" cascade;');

        this.addSql('drop table if exists "t_order_item" cascade;');

        this.addSql(
            'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
        );

        this.addSql(
            'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update cascade;',
        );

        this.addSql('alter table "t_inventory" drop column "c_order_item_id";');
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_transfer_item" drop constraint "t_transfer_item_c_transfer_id_foreign";',
        );

        this.addSql(
            'create table "t_order" ("id" serial primary key, "c_created_at" timestamptz not null default null, "c_updated_at" timestamptz null default null, "c_name" varchar not null default null, "c_description" varchar null default null, "c_created_by" varchar null default null, "c_status" text check ("c_status" in (\'NEW\', \'READY\', \'DELIVERING\', \'DELIVERED\', \'DONE\', \'CANCELED\', \'RETURNED\')) not null default \'NEW\', "c_from_id" int4 not null default null, "c_to_id" int4 not null default null);',
        );

        this.addSql(
            'create table "t_order_item" ("id" serial primary key, "c_created_at" timestamptz not null default null, "c_updated_at" timestamptz null default null, "c_description" varchar null default null, "c_inventory_amount" int4 not null default null, "c_order_id" int4 not null default null);',
        );

        this.addSql(
            'alter table "t_order" add constraint "t_order_c_from_id_foreign" foreign key ("c_from_id") references "t_destination" ("id") on update cascade on delete no action;',
        );
        this.addSql(
            'alter table "t_order" add constraint "t_order_c_to_id_foreign" foreign key ("c_to_id") references "t_destination" ("id") on update cascade on delete no action;',
        );

        this.addSql(
            'alter table "t_order_item" add constraint "t_order_item_c_order_id_foreign" foreign key ("c_order_id") references "t_order" ("id") on update cascade on delete no action;',
        );

        this.addSql('drop table if exists "t_transfer" cascade;');

        this.addSql('drop table if exists "t_transfer_item" cascade;');

        this.addSql(
            'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
        );

        this.addSql(
            'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update set null on delete cascade;',
        );

        this.addSql(
            'alter table "t_inventory" add column "c_order_item_id" int4 null default null;',
        );
        this.addSql(
            'alter table "t_inventory" add constraint "t_inventory_c_order_item_id_foreign" foreign key ("c_order_item_id") references "t_order_item" ("id") on update cascade on delete set null;',
        );
    }
}
