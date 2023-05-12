import { Migration } from '@mikro-orm/migrations';

export class Migration20230508072044 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "location" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) null);',
    );
    this.addSql(
      'alter table "location" add constraint "location_name_unique" unique ("name");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "location" cascade;');
  }
}
