import { Migration } from '@mikro-orm/migrations';

export class Migration20230505151918 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "warehouse" add constraint "warehouse_name_unique" unique ("name");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "warehouse" drop constraint "warehouse_name_unique";');
  }
}
