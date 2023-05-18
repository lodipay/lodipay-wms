import { Migration } from '@mikro-orm/migrations';

export class Migration20230518015119 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table \"order\" add column \"status\" text check (\"status\" in ('NEW', 'READY', 'DELIVERING', 'DELIVERED', 'DONE', 'CANCELED', 'RETURNED')) not null;",
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop column "status";');
  }
}
