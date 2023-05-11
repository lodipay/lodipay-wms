import { Migration } from '@mikro-orm/migrations';

export class Migration20230511033305 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "destination" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" timestamptz(0) null, "description" varchar(255) not null);');

    this.addSql(
      'create table "order" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" timestamptz(0) null, "name" varchar(255) not null, "description" varchar(255) null, "created_by" varchar(255) null, "from_id" int not null, "to_id" int not null);',
    );

    this.addSql('alter table "order" add constraint "order_from_id_foreign" foreign key ("from_id") references "destination" ("id") on update cascade;');
    this.addSql('alter table "order" add constraint "order_to_id_foreign" foreign key ("to_id") references "destination" ("id") on update cascade;');

    this.addSql('alter table "warehouse" add column "destination_id" int not null;');
    this.addSql('alter table "warehouse" add constraint "warehouse_destination_id_foreign" foreign key ("destination_id") references "destination" ("id") on update cascade;');
    this.addSql('alter table "warehouse" add constraint "warehouse_destination_id_unique" unique ("destination_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order" drop constraint "order_from_id_foreign";');

    this.addSql('alter table "order" drop constraint "order_to_id_foreign";');

    this.addSql('alter table "warehouse" drop constraint "warehouse_destination_id_foreign";');

    this.addSql('drop table if exists "destination" cascade;');

    this.addSql('drop table if exists "order" cascade;');

    this.addSql('alter table "warehouse" drop constraint "warehouse_destination_id_unique";');
    this.addSql('alter table "warehouse" drop column "destination_id";');
  }
}
