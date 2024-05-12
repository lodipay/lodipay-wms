import { FilterService } from '@/common/module/filter/filter.service';
import { Asndetail } from '@/database/entities/asn-detail.entity';
import { Asnlist } from '@/database/entities/asn-list.entity';
import { Goods } from '@/database/entities/goods.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { Supplier } from '../../database/entities/supplier.entity';
import { CreateAsnDto } from './dto/create-asn.dto';
import { UpdateAsnDetailDto } from './dto/update-asn-detail.dto';
import { AsnStatus } from '@/common/enum/asn-status.enum';

@Injectable()
export class InboundService {
    constructor(
        @InjectRepository(Asndetail)
        private asnDetailRepo: EntityRepository<Asndetail>,

        @InjectRepository(Supplier)
        private supplierRepo: EntityRepository<Supplier>,

        @InjectRepository(Goods)
        private goodsRepo: EntityRepository<Goods>,
        private em: EntityManager,
        private filterService: FilterService,
    ) {}

    async createAsn(createAsnDto: CreateAsnDto) {
        const asnExists = await this.asnDetailRepo.findOne({
            openId: createAsnDto.openId,
        });

        if (asnExists) {
            throw new InvalidArgumentException('Asn already exists');
        }
        const supplier = await this.supplierRepo.findOne({
            supplierName: createAsnDto.supplierName,
        });
        if (!supplier) {
            throw new InvalidArgumentException('Supplier not found');
        }

        const asnItem = new Asnlist();
        asnItem.openId = createAsnDto.openId;
        asnItem.supplier = supplier;
        asnItem.barCode = createAsnDto.barCode;
        asnItem.asnCode = createAsnDto.asnCode;


        await this.em.persistAndFlush(asnItem);

        const goods = createAsnDto.goods;
        goods.forEach(async good => {
            const goodItem = await this.goodsRepo.findOne({
                goodsCode: good.goodsCode,
            });
            if (!goodItem) {
                throw new InvalidArgumentException('goods not found');
            }
            const asnItemDetail = new Asndetail();
            asnItemDetail.goodsCode = goodItem.goodsCode;
            asnItemDetail.goodsDesc = goodItem.goodsDesc;
            asnItemDetail.goodsActualQty = good.goodsQty;
            asnItemDetail.goodsQty = good.goodsQty;
            asnItemDetail.sortedQty = good.goodsQty;
            asnItemDetail.goodsShortageQty = good.goodsQty;
            asnItemDetail.goodsMoreQty = good.goodsQty;
            asnItemDetail.goodsDamageQty = good.goodsQty;

            asnItemDetail.goodsWeight = goodItem.goodsWeight;
            asnItemDetail.goodsVolume = goodItem.goodsW;
            asnItemDetail.goodsCost = goodItem.goodsCost;

            asnItemDetail.openId = createAsnDto.openId;
            asnItemDetail.asnCode = createAsnDto.asnCode;
            asnItemDetail.asnStatus = createAsnDto.asnStatus;
            asnItemDetail.asnList = asnItem;
            asnItemDetail.supplier = supplier;

            await this.em.persistAndFlush(asnItemDetail);
        });

        return asnItem;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Asndetail>(Asndetail, filterDto);
    }

    async findOne(id: number) {
        const asn = await this.asnDetailRepo.findOne(id);
        if (!asn) {
            throw new InvalidArgumentException('asn not found');
        }
        return asn;
    }
    async updateAsnDetail(id: number, updateAsnDetailDto: UpdateAsnDetailDto) {
        const asnDetail = await this.findOne(id);

        const qb = this.em.createQueryBuilder(Asndetail, 'ad');
        await qb.update({
            goodsActualQty: updateAsnDetailDto.goodsActualQty
                ? qb.raw(
                      `ad.c_goods_actual_qty + ${updateAsnDetailDto.goodsActualQty}`,
                  )
                : updateAsnDetailDto.goodsActualQty,
            sortedQty: updateAsnDetailDto.sortedQty,
            goodsShortageQty: updateAsnDetailDto.goodsShortageQty,
            goodsMoreQty: updateAsnDetailDto.goodsMoreQty
                ? qb.raw(
                      `ad.c_goods_more_qty + ${updateAsnDetailDto.goodsMoreQty}`,
                  )
                : updateAsnDetailDto.goodsMoreQty,
            goodsDamageQty: updateAsnDetailDto.goodsDamageQty
                ? qb.raw(
                      `ad.c_goods_damage_qty + ${updateAsnDetailDto.goodsDamageQty}`,
                  )
                : updateAsnDetailDto.goodsDamageQty,
        });
    }

    async confirmAsn(id: number) {
        const asn = await this.findOne(id);
        if (asn.asnStatus === AsnStatus.CONFIRMED) {
            throw new InvalidArgumentException('asn already confirmed');
        }
        asn.asnStatus = AsnStatus.CONFIRMED;
        await this.em.persistAndFlush(asn);
        return asn;
    }
    async remove(id: number) {
        const supplier = await this.findOne(id);

        await this.em.removeAndFlush(supplier);

        return 'deleted';
    }
}
