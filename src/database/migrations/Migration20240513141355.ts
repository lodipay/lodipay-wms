import { Migration } from '@mikro-orm/migrations';

export class Migration20240513141355 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "t_stock_list" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_is_delete" boolean not null default false, "c_creater" varchar(255) null, "c_goods_code" varchar(255) not null, "c_goods_desc" varchar(255) not null, "c_goods_qty" int not null, "c_onhand_stock" int not null, "c_can_order_stock" int not null, "c_ordered_stock" int not null, "c_inspect_stock" int not null, "c_hold_stock" int not null, "c_damage_stock" int not null, "c_asn_stock" int not null, "c_dn_stock" int not null, "c_pre_load_stock" int not null, "c_pre_sort_stock" int not null, "c_sorted_stock" int not null, "c_pick_stock" int not null, "c_picked_stock" int not null, "c_back_order_stock" int not null, "c_supplier_id" int not null, "c_openid" varchar(255) not null);');

    this.addSql('alter table "t_stock_list" add constraint "t_stock_list_c_supplier_id_foreign" foreign key ("c_supplier_id") references "t_supplier" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "t_stock_list" cascade;');
  }

}
