import { Migration } from '@mikro-orm/migrations';

export class Migration20230528120033 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "t_inventory" drop constraint "t_inventory_c_transfer_item_id_foreign";');

    this.addSql('alter table "t_inventory" drop column "c_transfer_item_id";');

    this.addSql('alter table "t_transfer_item" add column "c_inventory_id" int not null;');
    this.addSql('alter table "t_transfer_item" add constraint "t_transfer_item_c_inventory_id_foreign" foreign key ("c_inventory_id") references "t_inventory" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_transfer_item" drop constraint "t_transfer_item_c_inventory_id_foreign";');

    this.addSql('alter table "t_inventory" add column "c_transfer_item_id" int4 null default null;');
    this.addSql('alter table "t_inventory" add constraint "t_inventory_c_transfer_item_id_foreign" foreign key ("c_transfer_item_id") references "t_transfer_item" ("id") on update cascade on delete set null;');

    this.addSql('alter table "t_transfer_item" drop column "c_inventory_id";');
  }

}
