import { Migration } from '@mikro-orm/migrations';

export class Migration20240508073709 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "t_supplier" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_supplier_name" varchar(50) not null, "c_supplier_city" varchar(50) null, "c_supplier_address" varchar(255) null, "c_supplier_contact" varchar(20) not null, "c_supplier_manager" int null, "c_supplier_level" smallint null, "c_open_id" varchar(64) not null);');

    this.addSql('create table "t_asnlist" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_asn_code" varchar(64) not null, "c_asn_status" varchar(255) not null default \'predelivery\', "c_total_weight" int null, "c_total_volume" int null, "c_total_cost" int null, "c_supplier_id" int not null, "c_bar_code" varchar(64) not null, "c_openid" varchar(64) not null, "c_transportation_fee" jsonb not null);');

    this.addSql('create table "t_asndetail" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_asn_code" varchar(64) not null, "c_asn_status" varchar(255) not null default \'predelivery\', "c_supplier_id" int not null, "c_goods_code" varchar(64) not null, "c_goods_desc" varchar(255) not null, "c_goods_qty" varchar(8) not null, "c_goods_actual_qty" varchar(8) not null, "c_sorted_qty" varchar(8) not null, "c_goods_shortage_qty" varchar(8) not null, "c_goods_more_qty" varchar(8) not null, "c_goods_damage_qty" varchar(8) not null, "c_goods_weight" varchar(255) not null, "c_goods_volume" varchar(255) not null, "c_goods_cost" varchar(255) not null, "c_open_id" varchar(255) not null);');

    this.addSql('alter table "t_asnlist" add constraint "t_asnlist_c_supplier_id_foreign" foreign key ("c_supplier_id") references "t_supplier" ("id") on update cascade;');

    this.addSql('alter table "t_asndetail" add constraint "t_asndetail_c_supplier_id_foreign" foreign key ("c_supplier_id") references "t_supplier" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_asnlist" drop constraint "t_asnlist_c_supplier_id_foreign";');

    this.addSql('alter table "t_asndetail" drop constraint "t_asndetail_c_supplier_id_foreign";');

    this.addSql('drop table if exists "t_supplier" cascade;');

    this.addSql('drop table if exists "t_asnlist" cascade;');

    this.addSql('drop table if exists "t_asndetail" cascade;');
  }

}
