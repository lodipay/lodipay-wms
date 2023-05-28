import {
    Collection,
    Entity,
    Enum,
    ManyToOne,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { TransferStatus } from '../../common/enum/transfer-status.enum';
import { Destination } from './destination.entity';
import { ParentEntity } from './parent.entity';
import { TransferItem } from './transfer-item.entity';

@Entity()
export class Transfer extends ParentEntity {
    @Property()
    name: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ nullable: true })
    createdBy?: string;

    @Enum(() => TransferStatus)
    status = TransferStatus.NEW;

    @ManyToOne({ entity: () => Destination })
    from: Destination;

    @ManyToOne({ entity: () => Destination })
    to: Destination;

    @OneToMany({
        entity: () => TransferItem,
        mappedBy: 'transfer',
        orphanRemoval: true,
    })
    transferItems = new Collection<TransferItem>(this);

    constructor(name?: string, description?: string, createdBy?: string) {
        super();
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
    }
}
