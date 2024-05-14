import { AsnStatus } from '@/common/enum/asn-status.enum';
import { FilterService } from '@/common/module/filter/filter.service';
import { Asndetail } from '@/database/entities/asn-detail.entity';
import { Asnlist } from '@/database/entities/asn-list.entity';
import { Goods } from '@/database/entities/goods.entity';
import { StockList } from '@/database/entities/stock-list.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { Supplier } from '../../database/entities/supplier.entity';
import { CreateAsnDto } from './dto/create-asn.dto';
import { UpdateAsnDetailDto } from './dto/update-asn-detail.dto';
import { UpdateAsnDto } from './dto/update-asn.dto';

@Injectable()
export class InboundService {
    constructor(
        @InjectRepository(Asndetail)
        private asnDetailRepo: EntityRepository<Asndetail>,

        @InjectRepository(Asnlist)
        private asnListRepo: EntityRepository<Asnlist>,

        @InjectRepository(Supplier)
        private supplierRepo: EntityRepository<Supplier>,

        @InjectRepository(Goods)
        private goodsRepo: EntityRepository<Goods>,

        @InjectRepository(StockList)
        private stockListRepo: EntityRepository<StockList>,

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

        const goods = createAsnDto.goods;
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
                    asnStock: qb.raw(`sl.c_asn_stock + ${good.goodsQty}`),
                })
                .where({
                    goodsCode: good.goodsCode,
                    supplier: supplier,
                })
                .execute();
            const asnItemDetail = new Asndetail();
            asnItemDetail.goodsCode = goodItem.goodsCode;
            asnItemDetail.goodsDesc = goodItem.goodsDesc;
            asnItemDetail.goodsActualQty = 0;
            asnItemDetail.goodsQty = good.goodsQty;
            asnItemDetail.sortedQty = 0;
            asnItemDetail.goodsShortageQty = 0;
            asnItemDetail.goodsMoreQty = 0;
            asnItemDetail.goodsDamageQty = 0;

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
        await this.em.persistAndFlush(asnItem);
        return asnItem;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Asndetail>(Asndetail, filterDto);
    }

    async findAsnDetailOne(id: number) {
        const asn = await this.asnDetailRepo.findOne(id);
        if (!asn) {
            throw new InvalidArgumentException('asn detail not found');
        }
        return asn;
    }
    async findAsnListOne(id: number) {
        const asn = await this.asnListRepo.findOne(id);
        if (!asn) {
            throw new InvalidArgumentException('asn not found');
        }
        return asn;
    }
    async update(id: number, updateAsnListDto: UpdateAsnDto) {
        const asnList = await this.findAsnListOne(id);

        if (
            updateAsnListDto.asnCode &&
            updateAsnListDto.asnCode !== asnList.asnCode
        ) {
            throw new InvalidArgumentException('asn code cannot be changed');
        }

        const supplier = await this.supplierRepo.findOne({
            supplierName: updateAsnListDto.supplierName,
        });
        asnList.supplier = supplier;
        const goods = updateAsnListDto.goods;
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
                    asnStock: qb.raw(`sl.c_asn_stock + ${good.goodsQty}`),
                })
                .where({
                    goodsCode: good.goodsCode,
                    supplier: supplier,
                })
                .execute();

            const asnItemDetail = new Asndetail();
            asnItemDetail.goodsCode = goodItem.goodsCode;
            asnItemDetail.goodsDesc = goodItem.goodsDesc;
            asnItemDetail.goodsActualQty = 0;
            asnItemDetail.goodsQty = good.goodsQty;
            asnItemDetail.sortedQty = 0;
            asnItemDetail.goodsShortageQty = 0;
            asnItemDetail.goodsMoreQty = 0;
            asnItemDetail.goodsDamageQty = 0;

            asnItemDetail.goodsWeight = goodItem.goodsWeight;
            asnItemDetail.goodsVolume = goodItem.goodsW;
            asnItemDetail.goodsCost = goodItem.goodsCost;

            asnItemDetail.openId = updateAsnListDto.openId;
            asnItemDetail.asnCode = updateAsnListDto.asnCode;
            asnItemDetail.asnStatus = updateAsnListDto.asnStatus;
            asnItemDetail.asnList = asnList;
            asnItemDetail.supplier = supplier;

            await this.em.persistAndFlush(asnItemDetail);
        });
    }
    async updateAsnDetail(id: number, updateAsnDetailDto: UpdateAsnDetailDto) {
        const asnDetail = await this.findAsnDetailOne(id);

        const qb = this.em.createQueryBuilder(Asndetail, 'ad');
        await qb
            .update({
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
            })
            .where({
                id: id,
            })
            .execute();
    }

    async confirmArrival(id: number) {
        const asn = await this.findAsnListOne(id);
        if (asn.asnStatus !== AsnStatus.PENDINGARRIVAL) {
            throw new BadRequestException(
                'asn already confirmed or status is not correct',
            );
        }
        asn.asnStatus = AsnStatus.PENDINGUNLOADING;
        await this.em.persistAndFlush(asn);
        return asn;
    }
    async confirmUnloading(id: number) {
        const asn = await this.findAsnListOne(id);
        if (asn.asnStatus !== AsnStatus.WAITINGFORUNLOADING) {
            throw new BadRequestException(
                'asn already confirmed or status is not correct',
            );
        }
        asn.asnStatus = AsnStatus.WAITINGFORSORTING;
        await this.em.persistAndFlush(asn);
        return asn;
    }
    async confirmSorting(
        id: number,
        goods: Array<{ goodsCode: string; goodsActualQty: number }>,
    ) {
        const asn = await this.findAsnListOne(id);
        if (asn.asnStatus !== AsnStatus.WAITINGFORSORTING) {
            throw new BadRequestException(
                'asn already confirmed or status is not correct',
            );
        }
        asn.asnStatus = AsnStatus.SORTED;

        goods.map(async good => {
            const asnDetail = await this.asnDetailRepo.findOne({
                goodsCode: good.goodsCode,
            });
            if (!asnDetail) {
                throw new InvalidArgumentException('asn detail not found');
            }
            asnDetail.goodsActualQty = good.goodsActualQty;
        });

        await this.em.persistAndFlush(asn);
        return asn;
    }
    async remove(id: number) {
        const supplier = await this.findAsnListOne(id);

        await this.em.removeAndFlush(supplier);

        return 'deleted';
    }
}
