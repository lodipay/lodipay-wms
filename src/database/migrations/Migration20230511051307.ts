import { Migration } from '@mikro-orm/migrations';

export class Migration20230511051307 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "destination" add column "name" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "destination" drop column "name";');
  }
}
