import {
    Collection,
    Entity,
    Filter,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { ParentEntity } from './parent.entity';
import { TenantItem } from './tenant-item.entity';
import { TransferItem } from './transfer-item.entity';

@Entity()
@Filter({ name: 'mainFilter', cond: args => args })
export class Tenant extends ParentEntity {
    @Property()
    name: string;

    @Property()
    description?: string;

    @OneToMany({
        entity: () => TenantItem,
        mappedBy: 'tenant',
    })
    tenantItems = new Collection<TenantItem>(this);

    @OneToMany({
        entity: () => TransferItem,
        mappedBy: 'fromTenant',
    })
    fromTenant = new Collection<TransferItem>(this);

    @OneToMany({
        entity: () => TransferItem,
        mappedBy: 'toTenant',
    })
    toTenant = new Collection<TransferItem>(this);
}
