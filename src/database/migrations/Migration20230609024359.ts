import { Migration } from '@mikro-orm/migrations';

export class Migration20230609024359 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'alter table "t_tenant_item" alter column "c_description" type varchar(255) using ("c_description"::varchar(255));',
        );
        this.addSql(
            'alter table "t_tenant_item" alter column "c_description" drop not null;',
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "t_tenant_item" alter column "c_description" type varchar using ("c_description"::varchar);',
        );
        this.addSql(
            'alter table "t_tenant_item" alter column "c_description" set not null;',
        );
    }
}
