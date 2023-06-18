import { Migration } from '@mikro-orm/migrations';

export class Migration20230602080745 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "t_transfer" drop constraint "t_transfer_c_from_id_foreign";',
        );

        this.addSql(
            'alter table "t_transfer" alter column "c_from_id" type int using ("c_from_id"::int);',
        );
        this.addSql(
            'alter table "t_transfer" alter column "c_from_id" drop not null;',
        );
        this.addSql(
            'alter table "t_transfer" add constraint "t_transfer_c_from_id_foreign" foreign key ("c_from_id") references "t_destination" ("id") on update cascade on delete set null;',
        );

        this.addSql(
            'alter table "t_transfer_item" rename column "c_inventory_amount" to "c_quantity";',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_transfer" drop constraint "t_transfer_c_from_id_foreign";',
        );

        this.addSql(
            'alter table "t_transfer" alter column "c_from_id" type int4 using ("c_from_id"::int4);',
        );
        this.addSql(
            'alter table "t_transfer" alter column "c_from_id" set not null;',
        );
        this.addSql(
            'alter table "t_transfer" add constraint "t_transfer_c_from_id_foreign" foreign key ("c_from_id") references "t_destination" ("id") on update cascade on delete no action;',
        );

        this.addSql(
            'alter table "t_transfer_item" rename column "c_quantity" to "c_inventory_amount";',
        );
    }
}
