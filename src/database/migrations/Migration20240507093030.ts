import { Migration } from '@mikro-orm/migrations';

export class Migration20240507093030 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "t_goods_brand" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_brand" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('create table "t_goods_class" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_class" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('create table "t_goods_color" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_color" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('create table "t_goods_origin" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_origin" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('create table "t_goods_shape" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_shape" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('create table "t_goods_specs" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_specs" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('create table "t_goods_unit" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_unit" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('create table "t_goods" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_code" varchar(255) not null, "c_goods_desc" varchar(255) not null, "c_goods_supplier" varchar(255) not null, "c_goods_weight" int not null, "c_goods_w" int not null, "c_goods_d" int not null, "c_goods_h" int not null, "c_unit_volume" int null, "c_goods_unit_id" int not null, "c_goods_class_id" int not null, "c_goods_brand_id" int not null, "c_goods_color_id" int not null, "c_goods_shape_id" int not null, "c_goods_specs_id" int null, "c_goods_origin_id" int null, "c_safety_stock" int not null, "c_goods_cost" int null, "c_goods_price" int not null, "c_bar_code" varchar(255) null, "c_openid" varchar(255) not null);');

    this.addSql('alter table "t_goods" add constraint "t_goods_c_goods_unit_id_foreign" foreign key ("c_goods_unit_id") references "t_goods_unit" ("id") on update cascade;');
    this.addSql('alter table "t_goods" add constraint "t_goods_c_goods_class_id_foreign" foreign key ("c_goods_class_id") references "t_goods_class" ("id") on update cascade;');
    this.addSql('alter table "t_goods" add constraint "t_goods_c_goods_brand_id_foreign" foreign key ("c_goods_brand_id") references "t_goods_brand" ("id") on update cascade;');
    this.addSql('alter table "t_goods" add constraint "t_goods_c_goods_color_id_foreign" foreign key ("c_goods_color_id") references "t_goods_color" ("id") on update cascade;');
    this.addSql('alter table "t_goods" add constraint "t_goods_c_goods_shape_id_foreign" foreign key ("c_goods_shape_id") references "t_goods_shape" ("id") on update cascade;');
    this.addSql('alter table "t_goods" add constraint "t_goods_c_goods_specs_id_foreign" foreign key ("c_goods_specs_id") references "t_goods_specs" ("id") on update cascade on delete set null;');
    this.addSql('alter table "t_goods" add constraint "t_goods_c_goods_origin_id_foreign" foreign key ("c_goods_origin_id") references "t_goods_origin" ("id") on update cascade on delete set null;');

    this.addSql('alter table "t_tenant" add column "c_is_delete" boolean not null default false, add column "c_creater" varchar(255) null;');

    this.addSql('alter table "t_warehouse" add column "c_is_delete" boolean not null default false, add column "c_creater" varchar(255) null;');

    this.addSql('alter table "t_tenant_item" add column "c_is_delete" boolean not null default false, add column "c_creater" varchar(255) null;');

    this.addSql('alter table "t_inventory_location" add column "c_is_delete" boolean not null default false, add column "c_creater" varchar(255) null;');

    this.addSql('alter table "t_destination" add column "c_is_delete" boolean not null default false, add column "c_creater" varchar(255) null;');

    this.addSql('alter table "t_transfer" add column "c_is_delete" boolean not null default false, add column "c_creater" varchar(255) null;');

    this.addSql('alter table "t_transfer_item" add column "c_is_delete" boolean not null default false, add column "c_creater" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_goods" drop constraint "t_goods_c_goods_brand_id_foreign";');

    this.addSql('alter table "t_goods" drop constraint "t_goods_c_goods_class_id_foreign";');

    this.addSql('alter table "t_goods" drop constraint "t_goods_c_goods_color_id_foreign";');

    this.addSql('alter table "t_goods" drop constraint "t_goods_c_goods_origin_id_foreign";');

    this.addSql('alter table "t_goods" drop constraint "t_goods_c_goods_shape_id_foreign";');

    this.addSql('alter table "t_goods" drop constraint "t_goods_c_goods_specs_id_foreign";');

    this.addSql('alter table "t_goods" drop constraint "t_goods_c_goods_unit_id_foreign";');

    this.addSql('drop table if exists "t_goods_brand" cascade;');

    this.addSql('drop table if exists "t_goods_class" cascade;');

    this.addSql('drop table if exists "t_goods_color" cascade;');

    this.addSql('drop table if exists "t_goods_origin" cascade;');

    this.addSql('drop table if exists "t_goods_shape" cascade;');

    this.addSql('drop table if exists "t_goods_specs" cascade;');

    this.addSql('drop table if exists "t_goods_unit" cascade;');

    this.addSql('drop table if exists "t_goods" cascade;');

    this.addSql('alter table "t_destination" drop column "c_is_delete";');
    this.addSql('alter table "t_destination" drop column "c_creater";');

    this.addSql('alter table "t_inventory_location" drop column "c_is_delete";');
    this.addSql('alter table "t_inventory_location" drop column "c_creater";');

    this.addSql('alter table "t_tenant" drop column "c_is_delete";');
    this.addSql('alter table "t_tenant" drop column "c_creater";');

    this.addSql('alter table "t_tenant_item" drop column "c_is_delete";');
    this.addSql('alter table "t_tenant_item" drop column "c_creater";');

    this.addSql('alter table "t_transfer" drop column "c_is_delete";');
    this.addSql('alter table "t_transfer" drop column "c_creater";');

    this.addSql('alter table "t_transfer_item" drop column "c_is_delete";');
    this.addSql('alter table "t_transfer_item" drop column "c_creater";');

    this.addSql('alter table "t_warehouse" drop column "c_is_delete";');
    this.addSql('alter table "t_warehouse" drop column "c_creater";');
  }

}
