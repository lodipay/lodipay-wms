import { Migration } from '@mikro-orm/migrations';

export class Migration20230509063032 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "lock" ("id" serial primary key, "reason" varchar(255) not null, "from" timestamptz(0) null, "to" timestamptz(0) null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "lock" cascade;');
  }
}
