import {
    Collection,
    Entity,
    Filter,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
    Unique,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { InventoryLocation } from './inventory-location.entity';
import { TenantItem } from './tenant-item.entity';
import { TransferItem } from './transfer-item.entity';

@Entity()
@Filter({ name: 'mainFilter', cond: args => args })
export class Inventory {
    /**
     * Id
     */
    @PrimaryKey()
    id!: number;

    /**
     * Stocking Unit
     *
     * @example 'LODI1123233'
     */
    @Property()
    @Unique()
    sku: string;

    /**
     * Inventory name
     *
     * @example "Fashionable Men's Retro Slim Denim Shirt Black M"
     */
    @Property()
    name: string;

    @Property({ nullable: true })
    description?: string;

    /**
     * Inventory description
     *
     * @example "200"
     */
    @Property()
    quantity: number;

    @Property()
    expireDate?: Date;

    /**
     * Inventory description
     *
     * @example "R202301021001"
     */
    @Property()
    batchCode: string;

    /**
     * gramm
     *
     * @example "500"
     */
    @Property()
    weight?: number;

    /**
     * cm
     *
     * @example "20"
     */
    @Property()
    width?: number;

    /**
     * cm
     * @example "30"
     */
    @Property()
    height?: number;

    /**
     * cm
     * @example "40"
     */
    @Property()
    depth?: number;

    /**
     * cm3
     *
     * @example "1999800"
     */
    @Property()
    volume?: number;

    @OneToMany({ entity: () => Inventory, mappedBy: 'parent' })
    children = new Collection<Inventory>(this);

    @ManyToOne({ entity: () => Inventory })
    parent?: Inventory;

    @OneToMany({ entity: () => TransferItem, mappedBy: 'inventory' })
    transferItem = new Collection<TransferItem>(this);

    @OneToMany({
        entity: () => TenantItem,
        mappedBy: 'inventory',
    })
    tenantItem = new Collection<TenantItem>(this);

    @OneToMany({
        entity: () => InventoryLocation,
        mappedBy: 'inventory',
    })
    inventoryLocation = new Collection<InventoryLocation>(this);

    get parentId() {
        return this.parent?.id;
    }

    @ApiProperty()
    get parentKey() {
        return this.parent?.id;
    }
}
