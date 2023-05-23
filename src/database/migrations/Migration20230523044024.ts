import { Migration } from '@mikro-orm/migrations';

export class Migration20230523044024 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "t_bundle" add column "c_bundle_quantity" int not null;',
    );

    this.addSql('alter table "t_inventory" add column "c_bundle_id" int null;');
    this.addSql(
      'alter table "t_inventory" add constraint "t_inventory_c_bundle_id_foreign" foreign key ("c_bundle_id") references "t_bundle" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "t_inventory" drop constraint "t_inventory_c_bundle_id_foreign";',
    );

    this.addSql('alter table "t_bundle" drop column "c_bundle_quantity";');

    this.addSql('alter table "t_inventory" drop column "c_bundle_id";');
  }
}
