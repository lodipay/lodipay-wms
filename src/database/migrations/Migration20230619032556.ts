import { Migration } from '@mikro-orm/migrations';

export class Migration20230619032556 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "t_inventory_location" drop constraint "t_inventory_location_c_inventory_id_foreign";');

    this.addSql('alter table "t_inventory_location" rename column "c_inventory_id" to "c_tenant_item_id";');
    this.addSql('alter table "t_inventory_location" add constraint "t_inventory_location_c_tenant_item_id_foreign" foreign key ("c_tenant_item_id") references "t_tenant_item" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_inventory_location" drop constraint "t_inventory_location_c_tenant_item_id_foreign";');

    this.addSql('alter table "t_inventory_location" rename column "c_tenant_item_id" to "c_inventory_id";');
    this.addSql('alter table "t_inventory_location" add constraint "t_inventory_location_c_inventory_id_foreign" foreign key ("c_inventory_id") references "t_inventory" ("id") on update cascade on delete no action;');
  }

}
