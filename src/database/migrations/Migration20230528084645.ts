import { Migration } from '@mikro-orm/migrations';

export class Migration20230528084645 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
        );

        this.addSql(
            'alter table "t_order" drop constraint if exists "t_order_c_status_check";',
        );

        this.addSql(
            'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update cascade;',
        );

        this.addSql(
            'alter table "t_order" alter column "c_status" type text using ("c_status"::text);',
        );
        this.addSql(
            "alter table \"t_order\" add constraint \"t_order_c_status_check\" check (\"c_status\" in ('NEW', 'ACTIVE', 'INACTIVE', 'PACKING', 'PACKED', 'CANCELLED', 'DELIVERING', 'DELIVERED', 'RETURNING', 'RETURNED', 'RECEIVING', 'DONE'));",
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_bundle" drop constraint "t_bundle_c_bundle_holder_id_foreign";',
        );

        this.addSql(
            'alter table "t_order" drop constraint if exists "t_order_c_status_check";',
        );

        this.addSql(
            'alter table "t_bundle" add constraint "t_bundle_c_bundle_holder_id_foreign" foreign key ("c_bundle_holder_id") references "t_bundle_holder" ("id") on update set null on delete cascade;',
        );

        this.addSql(
            'alter table "t_order" alter column "c_status" type text using ("c_status"::text);',
        );
        this.addSql(
            "alter table \"t_order\" add constraint \"t_order_c_status_check\" check (\"c_status\" in ('NEW', 'READY', 'DELIVERING', 'DELIVERED', 'DONE', 'CANCELED', 'RETURNED'));",
        );
    }
}
