import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Inventory } from './inventory.entity';
import { ParentEntity } from './parent.entity';
import { Transfer } from './transfer.entity';

@Entity()
export class TransferItem extends ParentEntity {
    @Property()
    description?: string;

    @Property()
    inventoryAmount: number;

    @ManyToOne({ entity: () => Transfer })
    transfer!: Transfer;

    @ManyToOne({
        entity: () => Inventory,
        // mappedBy: 'transferItem',
        // orphanRemoval: false,
    })
    inventory: Inventory;
}
