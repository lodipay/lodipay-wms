import { Migration } from '@mikro-orm/migrations';

export class Migration20230609020845 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "t_tenant_item" add column "c_damaged_quantity" int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_tenant_item" drop column "c_damaged_quantity";');
  }

}
