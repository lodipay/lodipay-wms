import {
    Collection,
    Entity,
    Filter,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { BundleHolder } from './bundle-holder.entity';
import { Inventory } from './inventory.entity';
import { ParentEntity } from './parent.entity';

@Entity()
@Filter({ name: 'mainFilter', cond: args => args })
export class Bundle extends ParentEntity {
    @PrimaryKey()
    id: number;

    @Property()
    description: string;

    @Property()
    bundleQuantity: number;

    @Property({ nullable: true })
    activeFrom?: Date;

    @Property({ nullable: true })
    activeTo?: Date;

    @ManyToOne(() => BundleHolder, {
        onUpdateIntegrity: 'set null',
        onDelete: 'cascade',
    })
    bundleHolder: BundleHolder;

    @OneToMany({
        entity: () => Inventory,
        mappedBy: 'bundle',
        orphanRemoval: false,
    })
    inventories = new Collection<Inventory>(this);
}
