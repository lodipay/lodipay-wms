import { FilterService } from '@/common/module/filter/filter.service';
import { Goods } from '@/database/entities/goods.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { CreateDnDto } from './dto/create-dn.dto';
import { UpdateDnDetailDto } from './dto/update-dn-detail.dto';
import { Dndetail } from '@/database/entities/dn-detail.entity';
import { Dnlist } from '@/database/entities/dn-list';

@Injectable()
export class OutboundService {
    constructor(
        @InjectRepository(Dndetail)
        private dnDetailRepo: EntityRepository<Dndetail>,

        @InjectRepository(Goods)
        private goodsRepo: EntityRepository<Goods>,
        private em: EntityManager,
        private filterService: FilterService,
    ) {}

    async createDn(createDnDto: CreateDnDto) {
        const dnExists = await this.dnDetailRepo.findOne({
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
            const dnItemDetail = new Dndetail();
            dnItemDetail.goodsCode = goodItem.goodsCode;
            dnItemDetail.goodsDesc = goodItem.goodsDesc;
            dnItemDetail.goodsQty = good.goodsQty;
            dnItemDetail.pickQty = good.goodsQty;
            dnItemDetail.pickedQty = good.goodsQty;
            dnItemDetail.intransitQty = good.goodsQty;
            dnItemDetail.deliveryActualQty = good.goodsQty;
            dnItemDetail.deliveryShortageQty = good.goodsQty;
            dnItemDetail.deliveryMoreQty = good.goodsQty;
            dnItemDetail.deliveryDamageQty = good.goodsQty;

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

    async findOne(id: number) {
        const dn = await this.dnDetailRepo.findOne(id);
        if (!dn) {
            throw new InvalidArgumentException('dn not found');
        }
        return dn;
    }
    async updateDnDetail(id: number, updateDnDetailDto: UpdateDnDetailDto) {
        const dnDetail = await this.findOne(id);

        const qb = this.em.createQueryBuilder(Dndetail, 'dd');
        await qb.update({
            pickQty: updateDnDetailDto.pickQty
                ? qb.raw(
                      `ad.c_pick_qty + ${updateDnDetailDto.pickQty}`,
                  )
                : updateDnDetailDto.pickQty,
                intransitQty: updateDnDetailDto.intransitQty,
                deliveryActualQty: updateDnDetailDto.deliveryActualQty,
                deliveryShortageQty: updateDnDetailDto.deliveryShortageQty,
                deliveryMoreQty: updateDnDetailDto.deliveryMoreQty,
            pickedQty: updateDnDetailDto.pickedQty
                ? qb.raw(
                      `ad.c_picked_qty + ${updateDnDetailDto.pickedQty}`,
                  )
                : updateDnDetailDto.pickedQty,
            deliveryDamageQty: updateDnDetailDto.deliveryDamageQty
                ? qb.raw(
                      `ad.c_delivery__damage_qty + ${updateDnDetailDto.deliveryDamageQty}`,
                  )
                : updateDnDetailDto.deliveryDamageQty,
        });
    }

    async remove(id: number) {
        const supplier = await this.findOne(id);

        await this.em.removeAndFlush(supplier);

        return 'deleted';
    }
}
