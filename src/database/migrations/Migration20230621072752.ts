import { Migration } from '@mikro-orm/migrations';

export class Migration20230621072752 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "t_inventory_location" alter column "c_quantity" type int using ("c_quantity"::int);',
        );
        this.addSql(
            'alter table "t_inventory_location" alter column "c_quantity" set default 0;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_inventory_location" alter column "c_quantity" drop default;',
        );
        this.addSql(
            'alter table "t_inventory_location" alter column "c_quantity" type int4 using ("c_quantity"::int4);',
        );
    }
}
