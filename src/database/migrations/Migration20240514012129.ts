import { Migration } from '@mikro-orm/migrations';

export class Migration20240514012129 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "t_dnlist" alter column "c_dn_status" type varchar(255) using ("c_dn_status"::varchar(255));');
    this.addSql('alter table "t_dnlist" alter column "c_dn_status" set default \'pre order\';');

    this.addSql('alter table "t_dndetail" alter column "c_dn_status" type varchar(255) using ("c_dn_status"::varchar(255));');
    this.addSql('alter table "t_dndetail" alter column "c_dn_status" set default \'pre order\';');

    this.addSql('alter table "t_asndetail" alter column "c_asn_status" type varchar(255) using ("c_asn_status"::varchar(255));');
    this.addSql('alter table "t_asndetail" alter column "c_asn_status" set default \'pending arrival\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "t_asndetail" alter column "c_asn_status" type varchar using ("c_asn_status"::varchar);');
    this.addSql('alter table "t_asndetail" alter column "c_asn_status" set default \'predelivery\';');

    this.addSql('alter table "t_dndetail" alter column "c_dn_status" drop default;');
    this.addSql('alter table "t_dndetail" alter column "c_dn_status" type int8 using ("c_dn_status"::int8);');

    this.addSql('alter table "t_dnlist" alter column "c_dn_status" drop default;');
    this.addSql('alter table "t_dnlist" alter column "c_dn_status" type int8 using ("c_dn_status"::int8);');
  }

}
