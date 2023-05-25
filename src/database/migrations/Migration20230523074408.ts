import { Migration } from '@mikro-orm/migrations';

export class Migration20230523074408 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "t_warehouse_inventory" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_warehouse_id" int not null, "c_inventory_id" int not null, "c_quantity" int not null);',
        );

        this.addSql(
            'alter table "t_warehouse_inventory" add constraint "t_warehouse_inventory_c_warehouse_id_foreign" foreign key ("c_warehouse_id") references "t_warehouse" ("id") on update cascade;',
        );
        this.addSql(
            'alter table "t_warehouse_inventory" add constraint "t_warehouse_inventory_c_inventory_id_foreign" foreign key ("c_inventory_id") references "t_inventory" ("id") on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "t_warehouse_inventory" cascade;');
    }
}
