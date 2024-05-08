import { Migration } from '@mikro-orm/migrations';

export class Migration20240507073546 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "t_supplier" alter column "c_is_delete" type boolean using ("c_is_delete"::boolean);');
    this.addSql('alter table "t_supplier" alter column "c_is_delete" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_supplier" alter column "c_is_delete" type bool using ("c_is_delete"::bool);');
    this.addSql('alter table "t_supplier" alter column "c_is_delete" set not null;');
  }

}
