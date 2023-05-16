import { Migration } from '@mikro-orm/migrations';

export class Migration20230513091444 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "order_item" drop constraint "order_item_inventory_id_foreign";',
    );

    this.addSql(
      'alter table "order_item" add constraint "order_item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "order_item" drop constraint "order_item_inventory_id_foreign";',
    );

    this.addSql(
      'alter table "order_item" add constraint "order_item_inventory_id_foreign" foreign key ("inventory_id") references "inventory" ("id") on update cascade on delete no action;',
    );
  }
}
