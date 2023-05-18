import { Migration } from '@mikro-orm/migrations';

export class Migration20230518045653 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "lock" add column "active_from" timestamptz(0) null, add column "active_to" timestamptz(0) null;');
    this.addSql('alter table "lock" drop column "from";');
    this.addSql('alter table "lock" drop column "to";');

    this.addSql('alter table "order" add column "status" text check ("status" in (\'NEW\', \'READY\', \'DELIVERING\', \'DELIVERED\', \'DONE\', \'CANCELED\', \'RETURNED\')) not null default \'NEW\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lock" add column "from" timestamptz null default null, add column "to" timestamptz null default null;');
    this.addSql('alter table "lock" drop column "active_from";');
    this.addSql('alter table "lock" drop column "active_to";');

    this.addSql('alter table "order" drop column "status";');
  }

}
