import { Migration } from '@mikro-orm/migrations';

export class Migration20230518021029 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "order" drop constraint if exists "order_status_check";',
    );

    this.addSql(
      'alter table "order" alter column "status" type text using ("status"::text);',
    );
    this.addSql(
      "alter table \"order\" add constraint \"order_status_check\" check (\"status\" in ('READY', 'DELIVERING', 'DELIVERED', 'DONE', 'CANCELED', 'RETURNED'));",
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "order" drop constraint if exists "order_status_check";',
    );

    this.addSql(
      'alter table "order" alter column "status" type text using ("status"::text);',
    );
    this.addSql(
      "alter table \"order\" add constraint \"order_status_check\" check (\"status\" in ('NEW', 'READY', 'DELIVERING', 'DELIVERED', 'DONE', 'CANCELED', 'RETURNED'));",
    );
  }
}
