import { Migration } from '@mikro-orm/migrations';

export class Migration20240515025407 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "t_dnlist" alter column "c_dn_status" type varchar(255) using ("c_dn_status"::varchar(255));');
    this.addSql('alter table "t_dnlist" alter column "c_dn_status" set default \'pre-delivery\';');
    this.addSql('alter table "t_dnlist" drop column "c_customer";');

    this.addSql('alter table "t_dndetail" alter column "c_dn_status" type varchar(255) using ("c_dn_status"::varchar(255));');
    this.addSql('alter table "t_dndetail" alter column "c_dn_status" set default \'pre-delivery\';');
    this.addSql('alter table "t_dndetail" alter column "c_goods_weight" type int using ("c_goods_weight"::int);');
    this.addSql('alter table "t_dndetail" alter column "c_goods_weight" drop not null;');
    this.addSql('alter table "t_dndetail" alter column "c_goods_volume" type int using ("c_goods_volume"::int);');
    this.addSql('alter table "t_dndetail" alter column "c_goods_volume" drop not null;');
    this.addSql('alter table "t_dndetail" alter column "c_goods_cost" type int using ("c_goods_cost"::int);');
    this.addSql('alter table "t_dndetail" alter column "c_goods_cost" drop not null;');
    this.addSql('alter table "t_dndetail" drop column "c_customer";');

    this.addSql('alter table "t_asnlist" alter column "c_asn_status" type varchar(255) using ("c_asn_status"::varchar(255));');
    this.addSql('alter table "t_asnlist" alter column "c_asn_status" set default \'pending arrival\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_asnlist" alter column "c_asn_status" type varchar using ("c_asn_status"::varchar);');
    this.addSql('alter table "t_asnlist" alter column "c_asn_status" set default \'predelivery\';');

    this.addSql('alter table "t_dndetail" add column "c_customer" varchar not null default null;');
    this.addSql('alter table "t_dndetail" alter column "c_dn_status" type varchar using ("c_dn_status"::varchar);');
    this.addSql('alter table "t_dndetail" alter column "c_dn_status" set default \'pre order\';');
    this.addSql('alter table "t_dndetail" alter column "c_goods_weight" type int4 using ("c_goods_weight"::int4);');
    this.addSql('alter table "t_dndetail" alter column "c_goods_weight" set not null;');
    this.addSql('alter table "t_dndetail" alter column "c_goods_volume" type int4 using ("c_goods_volume"::int4);');
    this.addSql('alter table "t_dndetail" alter column "c_goods_volume" set not null;');
    this.addSql('alter table "t_dndetail" alter column "c_goods_cost" type int4 using ("c_goods_cost"::int4);');
    this.addSql('alter table "t_dndetail" alter column "c_goods_cost" set not null;');

    this.addSql('alter table "t_dnlist" add column "c_customer" varchar not null default null;');
    this.addSql('alter table "t_dnlist" alter column "c_dn_status" type varchar using ("c_dn_status"::varchar);');
    this.addSql('alter table "t_dnlist" alter column "c_dn_status" set default \'pre order\';');
  }

}
