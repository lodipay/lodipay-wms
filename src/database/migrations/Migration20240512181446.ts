import { Migration } from '@mikro-orm/migrations';

export class Migration20240512181446 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "t_dnlist" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_dn_code" varchar(64) not null, "c_dn_status" int8 not null, "c_total_weight" int null, "c_total_volume" int null, "c_total_cost" int null, "c_customer" varchar(255) not null, "c_bar_code" varchar(64) not null, "c_back_order_label" boolean not null, "c_open_id" varchar(64) not null, "c_transportation_fee" jsonb null);');

    this.addSql('create table "t_dndetail" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_dn_code" varchar(64) not null, "c_dn_status" int8 not null, "c_customer" varchar(255) not null, "c_goods_code" varchar(64) not null, "c_goods_desc" varchar(255) not null, "c_goods_qty" int not null, "c_pick_qty" int not null, "c_picked_qty" int not null, "c_intransit_qty" int not null, "c_delivery_actual_qty" int not null, "c_delivery_shortage_qty" int not null, "c_delivery_more_qty" int not null, "c_delivery_damage_qty" int not null, "c_goods_weight" int not null, "c_goods_volume" int not null, "c_goods_cost" int not null, "c_back_order_label" boolean not null, "c_open_id" varchar(255) not null, "c_dn_list_id" int not null);');

    this.addSql('create table "t_transportationfee" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_send_city" varchar(255) not null, "c_receiver_city" varchar(255) not null, "c_weight_fee" float8 not null, "c_volume_fee" float8 not null, "c_min_payment" float8 not null, "c_transportation_supplier" varchar(255) not null, "c_openid" varchar(255) not null);');

    this.addSql('alter table "t_dndetail" add constraint "t_dndetail_c_dn_list_id_foreign" foreign key ("c_dn_list_id") references "t_dnlist" ("id") on update cascade;');

    this.addSql('alter table "t_asnlist" alter column "c_asn_status" type varchar(255) using ("c_asn_status"::varchar(255));');
    this.addSql('alter table "t_asnlist" alter column "c_asn_status" drop not null;');
    this.addSql('alter table "t_asnlist" alter column "c_transportation_fee" type jsonb using ("c_transportation_fee"::jsonb);');
    this.addSql('alter table "t_asnlist" alter column "c_transportation_fee" drop not null;');
    this.addSql('alter table "t_asnlist" rename column "c_openid" to "c_open_id";');

    this.addSql('alter table "t_asndetail" add column "c_asn_list_id" int not null;');
    this.addSql('alter table "t_asndetail" alter column "c_goods_qty" type int using ("c_goods_qty"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_actual_qty" type int using ("c_goods_actual_qty"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_sorted_qty" type int using ("c_sorted_qty"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_shortage_qty" type int using ("c_goods_shortage_qty"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_more_qty" type int using ("c_goods_more_qty"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_damage_qty" type int using ("c_goods_damage_qty"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_weight" type int using ("c_goods_weight"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_volume" type int using ("c_goods_volume"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_cost" type int using ("c_goods_cost"::int);');
    this.addSql('alter table "t_asndetail" alter column "c_open_id" type varchar(64) using ("c_open_id"::varchar(64));');
    this.addSql('alter table "t_asndetail" add constraint "t_asndetail_c_asn_list_id_foreign" foreign key ("c_asn_list_id") references "t_asnlist" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_dndetail" drop constraint "t_dndetail_c_dn_list_id_foreign";');

    this.addSql('drop table if exists "t_dnlist" cascade;');

    this.addSql('drop table if exists "t_dndetail" cascade;');

    this.addSql('drop table if exists "t_transportationfee" cascade;');

    this.addSql('alter table "t_asndetail" drop constraint "t_asndetail_c_asn_list_id_foreign";');

    this.addSql('alter table "t_asndetail" alter column "c_goods_qty" type varchar using ("c_goods_qty"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_actual_qty" type varchar using ("c_goods_actual_qty"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_sorted_qty" type varchar using ("c_sorted_qty"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_shortage_qty" type varchar using ("c_goods_shortage_qty"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_more_qty" type varchar using ("c_goods_more_qty"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_damage_qty" type varchar using ("c_goods_damage_qty"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_weight" type varchar using ("c_goods_weight"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_volume" type varchar using ("c_goods_volume"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_goods_cost" type varchar using ("c_goods_cost"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_open_id" type varchar using ("c_open_id"::varchar);');
    this.addSql('alter table "t_asndetail" drop column "c_asn_list_id";');

    this.addSql('alter table "t_asnlist" alter column "c_asn_status" type varchar using ("c_asn_status"::varchar);');
    this.addSql('alter table "t_asnlist" alter column "c_asn_status" set not null;');
    this.addSql('alter table "t_asnlist" alter column "c_transportation_fee" type jsonb using ("c_transportation_fee"::jsonb);');
    this.addSql('alter table "t_asnlist" alter column "c_transportation_fee" set not null;');
    this.addSql('alter table "t_asnlist" rename column "c_open_id" to "c_openid";');
  }

}
