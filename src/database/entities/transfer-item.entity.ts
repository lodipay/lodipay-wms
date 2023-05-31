import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { TransferItemStatus } from '../../common/enum/transfer-item-status.enum';
import { Inventory } from './inventory.entity';
import { ParentEntity } from './parent.entity';
import { Transfer } from './transfer.entity';

@Entity()
export class TransferItem extends ParentEntity {
    @Property()
    description?: string;

    @Property()
    inventoryAmount: number;

    @Property({ nullable: true })
    transferedStatus: TransferItemStatus;

    @ManyToOne({ entity: () => Transfer })
    transfer!: Transfer;

    @ManyToOne({
        entity: () => Inventory,
    })
    inventory: Inventory;
}
