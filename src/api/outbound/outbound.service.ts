import { DnStatus } from '@/common/enum/dn-status.enum';
import { FilterService } from '@/common/module/filter/filter.service';
import { Dndetail } from '@/database/entities/dn-detail.entity';
import { Dnlist } from '@/database/entities/dn-list';
import { Goods } from '@/database/entities/goods.entity';
import { StockList } from '@/database/entities/stock-list.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { CreateDnDto } from './dto/create-dn.dto';
import { UpdateDnDto } from './dto/update-asn.dto';
import { UpdateDnDetailDto } from './dto/update-dn-detail.dto';

@Injectable()
export class OutboundService {
    constructor(
        @InjectRepository(Dndetail)
        private dnDetailRepo: EntityRepository<Dndetail>,

        @InjectRepository(Dnlist)
        private dnListRepo: EntityRepository<Dnlist>,

        @InjectRepository(Goods)
        private goodsRepo: EntityRepository<Goods>,

        @InjectRepository(StockList)
        private stockListRepo: EntityRepository<StockList>,

        private em: EntityManager,
        private filterService: FilterService,
    ) {}

    async createDn(createDnDto: CreateDnDto) {
        const dnExists = await this.dnListRepo.findOne({
            openId: createDnDto.openId,
        });

        if (dnExists) {
            throw new InvalidArgumentException('dn already exists');
        }

        const dnItem = new Dnlist();
        dnItem.openId = createDnDto.openId;
        dnItem.barCode = createDnDto.barCode;
        dnItem.dnCode = createDnDto.dnCode;
        dnItem.dnStatus = createDnDto.dnStatus;
        dnItem.backOrderLabel = createDnDto.backOrderLabel;
        await this.em.persistAndFlush(dnItem);
        
        const goods = createDnDto.goods;
        goods.forEach(async good => {
            const goodItem = await this.goodsRepo.findOne({
                goodsCode: good.goodsCode,
            });
            if (!goodItem) {
                throw new InvalidArgumentException('goods not found');
            }

            const qb = this.em.createQueryBuilder(StockList, 'sl');
            await qb
                .update({
                    asnStock: qb.raw(`sl.c_dn_stock + ${good.goodsQty}`),
                })
                .where({
                    goodsCode: good.goodsCode,
                })
                .execute();
            const dnItemDetail = new Dndetail();
            dnItemDetail.goodsCode = goodItem.goodsCode;
            dnItemDetail.goodsDesc = goodItem.goodsDesc;
            dnItemDetail.goodsQty = good.goodsQty;
            dnItemDetail.pickQty = 0;
            dnItemDetail.pickedQty = 0;
            dnItemDetail.intransitQty = 0;
            dnItemDetail.deliveryActualQty = 0;
            dnItemDetail.deliveryShortageQty = 0;
            dnItemDetail.deliveryMoreQty = 0;
            dnItemDetail.deliveryDamageQty = 0;

            dnItemDetail.goodsWeight = goodItem.goodsWeight;
            dnItemDetail.goodsVolume = goodItem.goodsW;
            dnItemDetail.goodsCost = goodItem.goodsCost;

            dnItemDetail.openId = createDnDto.openId;
            dnItemDetail.backOrderLabel = createDnDto.backOrderLabel;
            dnItemDetail.dnCode = createDnDto.dnCode;
            dnItemDetail.dnStatus = createDnDto.dnStatus;
            dnItemDetail.dnList = dnItem;

            await this.em.persistAndFlush(dnItemDetail);
        });
        
        return dnItem;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Dndetail>(Dndetail, filterDto);
    }

    async findDnDetail(id: number) {
        const dn = await this.dnDetailRepo.findOne(id);
        if (!dn) {
            throw new InvalidArgumentException('dn not found');
        }
        return dn;
    }

    async findDnListItem(id: number) {
        const dn = await this.dnListRepo.findOne(id);
        if (!dn) {
            throw new InvalidArgumentException('dn not found');
        }
        return dn;
    }
    async updateDnDetail(id: number, updateDnDetailDto: UpdateDnDetailDto) {
        const dnDetail = await this.findDnDetail(id);

        const qb = this.em.createQueryBuilder(Dndetail, 'dd');
        await qb
            .update({
                pickQty: updateDnDetailDto.pickQty
                    ? qb.raw(`ad.c_pick_qty + ${updateDnDetailDto.pickQty}`)
                    : updateDnDetailDto.pickQty,
                intransitQty: updateDnDetailDto.intransitQty,
                deliveryActualQty: updateDnDetailDto.deliveryActualQty,
                deliveryShortageQty: updateDnDetailDto.deliveryShortageQty,
                deliveryMoreQty: updateDnDetailDto.deliveryMoreQty,
                pickedQty: updateDnDetailDto.pickedQty
                    ? qb.raw(`ad.c_picked_qty + ${updateDnDetailDto.pickedQty}`)
                    : updateDnDetailDto.pickedQty,
                deliveryDamageQty: updateDnDetailDto.deliveryDamageQty
                    ? qb.raw(
                          `ad.c_delivery__damage_qty + ${updateDnDetailDto.deliveryDamageQty}`,
                      )
                    : updateDnDetailDto.deliveryDamageQty,
            })
            .where({
                id: id,
            })
            .execute();
    }

    async update(id: number, updateDnDto: UpdateDnDto) {
        const dnListItem = await this.findDnListItem(id);

        if (updateDnDto.dnCode !== dnListItem.dnCode) {
            throw new InvalidArgumentException('dn code not match');
        }
        const dnItem = new Dnlist();
        dnItem.openId = updateDnDto.openId;
        dnItem.barCode = updateDnDto.barCode;
        dnItem.dnCode = updateDnDto.dnCode;
        dnItem.dnStatus = updateDnDto.dnStatus;
        dnItem.backOrderLabel = updateDnDto.backOrderLabel;

        const goods = updateDnDto.goods;
        goods.forEach(async good => {
            const goodItem = await this.goodsRepo.findOne({
                goodsCode: good.goodsCode,
            });
            if (!goodItem) {
                throw new InvalidArgumentException('goods not found');
            }

            const qb = this.em.createQueryBuilder(StockList, 'sl');
            await qb
                .update({
                    asnStock: qb.raw(`sl.c_dn_stock + ${good.goodsQty}`),
                })
                .where({
                    goodsCode: good.goodsCode,
                })
                .execute();
            const dnItemDetail = new Dndetail();
            dnItemDetail.goodsCode = goodItem.goodsCode;
            dnItemDetail.goodsDesc = goodItem.goodsDesc;
            dnItemDetail.goodsQty = good.goodsQty;
            dnItemDetail.pickQty = 0;
            dnItemDetail.pickedQty = 0;
            dnItemDetail.intransitQty = 0;
            dnItemDetail.deliveryActualQty = 0;
            dnItemDetail.deliveryShortageQty = 0;
            dnItemDetail.deliveryMoreQty = 0;
            dnItemDetail.deliveryDamageQty = 0;

            dnItemDetail.goodsWeight = goodItem.goodsWeight;
            dnItemDetail.goodsVolume = goodItem.goodsW;
            dnItemDetail.goodsCost = goodItem.goodsCost;

            dnItemDetail.openId = updateDnDto.openId;
            dnItemDetail.backOrderLabel = updateDnDto.backOrderLabel;
            dnItemDetail.dnCode = updateDnDto.dnCode;
            dnItemDetail.dnStatus = updateDnDto.dnStatus;
            dnItemDetail.dnList = dnItem;

            await this.em.persistAndFlush(dnItemDetail);
        });
        await this.em.persistAndFlush(dnItem);
        return dnItem;
    }
    async confirmOrder(id: number) {
        const dnListItem = await this.findDnListItem(id);
        if (dnListItem.dnStatus !== DnStatus.PREDELIVERY) {
            throw new InvalidArgumentException('dn status not match');
        }
        dnListItem.dnStatus = DnStatus.NEWINVOICE;
        await this.em.persistAndFlush(dnListItem);
        return dnListItem;
    }
    async generatePickingList(id: number) {
        const dnListItem = await this.findDnListItem(id);
        if (dnListItem.dnStatus !== DnStatus.NEWDELIVERYORDER) {
            throw new InvalidArgumentException('dn status not match');
        }
        let stockIsEnough = true;
        dnListItem.dndetail.getItems().map(async dn => {
            if (!stockIsEnough) {
                return;
            }
            const stockItem = await this.stockListRepo.findOne({
                goodsCode: dn.goodsCode,
            });
            if (!stockItem) {
                throw new InvalidArgumentException('stock not found');
            }

            if (stockItem.goodsQty < dn.goodsQty) {
                dnListItem.dnStatus = DnStatus.BACKORDER;
                await this.em.persistAndFlush(dnListItem);
                stockIsEnough = false;
            }
        });
        if (stockIsEnough) {
            dnListItem.dnStatus = DnStatus.WAITINGFORPICKING;
            await this.em.persistAndFlush(dnListItem);
            return dnListItem;
        }
    }
    async getPickingList(id: number) {
        const dnListItem = await this.findDnListItem(id);
        if (dnListItem.dnStatus !== DnStatus.WAITINGFORSORTING) {
            throw new InvalidArgumentException('dn status not match');
        }
        return dnListItem;
    }
    async confirmPicking(
        id: number,
        goods: Array<{ goodsCode: string; goodsPickedQty: number }>,
    ) {
        const dnListItem = await this.findDnListItem(id);
        if (dnListItem.dnStatus !== DnStatus.WAITINGFORSORTING) {
            throw new InvalidArgumentException('dn status not match');
        }
        let isPicked = true;
        goods.map(async good => {
            const goodItem = await this.stockListRepo.findOne({
                goodsCode: good.goodsCode,
            });
            if (!goodItem) {
                throw new InvalidArgumentException('stock not found');
            }

            if (
                goodItem.goodsQty < good.goodsPickedQty ||
                good.goodsPickedQty < 0
            ) {
                isPicked = false;
                throw new InvalidArgumentException('goods qty not match');
            }
        });
        if (isPicked) {
            dnListItem.dnStatus = DnStatus.PICKED;
            await this.em.persistAndFlush(dnListItem);
        }
        return dnListItem;
    }

    async loadOrder(id: number) {
        const dnListItem = await this.findDnListItem(id);
        if (dnListItem.dnStatus !== DnStatus.PICKED) {
            throw new InvalidArgumentException('dn status not match');
        }
        dnListItem.dnStatus = DnStatus.COMPLETED;
        await this.em.persistAndFlush(dnListItem);
        return dnListItem;
    }
    async remove(id: number) {
        const supplier = await this.findDnListItem(id);

        await this.em.removeAndFlush(supplier);

        return 'deleted';
    }
}
