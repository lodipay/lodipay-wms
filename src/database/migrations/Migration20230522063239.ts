import { Migration } from '@mikro-orm/migrations';

export class Migration20230522063239 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "t_bundle_holder" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_name" varchar(255) not null, "c_description" varchar(255) null);',
        );

        this.addSql(
            'create table "t_bundle" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_description" varchar(255) not null, "c_active_from" timestamptz(0) null, "c_active_to" timestamptz(0) null, "c_bundle_holder_id" int not null);',
        );

        this.addSql(
            'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update cascade;',
        );

        this.addSql('drop table if exists "t_lock" cascade;');
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
        );

        this.addSql(
            'create table "t_lock" ("id" serial primary key, "c_reason" varchar not null default null, "c_active_from" timestamptz null default null, "c_active_to" timestamptz null default null);',
        );

        this.addSql('drop table if exists "t_bundle_holder" cascade;');

        this.addSql('drop table if exists "t_bundle" cascade;');
    }
}
