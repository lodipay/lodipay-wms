import { Migration } from '@mikro-orm/migrations';

export class Migration20230618062253 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "t_inventory_location" ("id" serial primary key, "c_created_at" timestamptz(0) not null, "c_updated_at" timestamptz(0) null, "c_quantity" int not null, "c_status" varchar(255) null, "c_location_id" int not null, "c_inventory_id" int not null);',
        );

        this.addSql(
            'alter table "t_inventory_location" add constraint "t_inventory_location_c_location_id_foreign" foreign key ("c_location_id") references "t_location" ("id") on update cascade;',
        );
        this.addSql(
            'alter table "t_inventory_location" add constraint "t_inventory_location_c_inventory_id_foreign" foreign key ("c_inventory_id") references "t_inventory" ("id") on update cascade;',
        );
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "t_inventory_location" cascade;');
    }
}
