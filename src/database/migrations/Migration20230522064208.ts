import { Migration } from '@mikro-orm/migrations';

export class Migration20230522064208 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
    );

    this.addSql(
      'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update set null on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
    );

    this.addSql(
      'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update cascade on delete no action;',
    );
  }
}
