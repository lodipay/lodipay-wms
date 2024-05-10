import { FilterService } from '@/common/module/filter/filter.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
    EntityManager,
    EntityRepository,
    QueryBuilder,
} from '@mikro-orm/postgresql';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FilterDto } from '../../common/dto/filter.dto';
import { InvalidArgumentException } from '../../common/exception/invalid.argument.exception';
import { Supplier } from '../../database/entities/supplier.entity';
import { CreateAsnDto } from './dto/create-asn.dto';
import { UpdateAsnDto } from './dto/update-asn.dto';
import { Asndetail } from '@/database/entities/asndetail.entity';

@Injectable()
export class InboundService {
    constructor(
        @InjectRepository(Asndetail)
        private asnDetailRepo: EntityRepository<Asndetail>,

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

        const asnItem = new Asndetail();
        
        asnItem.openId = createAsnDto.openId;
        const goods = createAsnDto.goods;



        await this.em.persistAndFlush(asnItem);
        return asnItem;
    }

    async createAsnDetail(createAsnDto: CreateAsnDto) {
        
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Supplier>(Supplier, filterDto);
    }

    async findOne(id: number) {
        const asn = await this.asnDetailRepo.findOne(id);
        if (!asn) {
            throw new InvalidArgumentException('asn not found');
        }
        return asn;
    }

    async update(id: number, updateAsnDto: UpdateAsnDto) {
        const supplier = await this.findOne(id);

        if (updateAsnDto.openId !== supplier.openId) {
            throw new InvalidArgumentException(
                'Supplier cannot be changed. Delete this supplier and create a new one',
            );
        }

        // const transfer = await this.transferService.findOne(
        //     supplier.transfer.id,
        // );

        // supplier.supplierName =
        //     updateAsnDto.supplierName || supplier.supplierName;
        // supplier.supplierManager =
        //     updateAsnDto.supplierManager || supplier.supplierManager;
        // supplier.supplierCity = updateAsnDto.supplierCity || supplier.supplierCity;
        // supplier.supplierAddress = updateAsnDto.supplierAddress || supplier.supplierAddress;

        await this.em.persistAndFlush(supplier);
        return supplier;
    }

    async remove(id: number) {
        const supplier = await this.findOne(id);

        await this.em.removeAndFlush(supplier);

        return 'deleted';
    }

}
