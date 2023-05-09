import { Migration } from '@mikro-orm/migrations';

export class Migration20230508231933 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "location" add column "warehouse_id" int not null;');
    this.addSql('alter table "location" drop constraint "location_name_unique";');
    this.addSql('alter table "location" add constraint "location_warehouse_id_foreign" foreign key ("warehouse_id") references "warehouse" ("id") on update cascade;');
    this.addSql('alter table "location" rename column "name" to "code";');
    this.addSql('alter table "location" add constraint "location_code_unique" unique ("code");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "location" drop constraint "location_warehouse_id_foreign";');

    this.addSql('alter table "location" drop constraint "location_code_unique";');
    this.addSql('alter table "location" drop column "warehouse_id";');
    this.addSql('alter table "location" rename column "code" to "name";');
    this.addSql('alter table "location" add constraint "location_name_unique" unique ("name");');
  }
}
