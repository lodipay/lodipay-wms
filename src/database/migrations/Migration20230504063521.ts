import { Migration } from '@mikro-orm/migrations';

export class Migration20230504063521 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "warehouse" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null);',
    );
  }
}
