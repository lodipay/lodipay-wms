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
        const supplierExists = await this.asnDetailRepo.findOne({
            openId: createAsnDto.openId,
        });

        if (supplierExists) {
            throw new InvalidArgumentException('Asn already exists');
        }

        const supplierItem = new Supplier();
        supplierItem.supplierName = createAsnDto.supplierName;
        supplierItem.supplierCity = createAsnDto.supplierCity;
        supplierItem.supplierAddress = createAsnDto.supplierAddress;
        supplierItem.isDelete = false;
        supplierItem.supplierContact = createAsnDto.supplierContact;
        supplierItem.supplierManager = createAsnDto.supplierManager;
        supplierItem.supplierLevel = createAsnDto.supplierLevel;
        supplierItem.openId = createAsnDto.openId;
        
        await this.em.persistAndFlush(supplierItem);
        return supplierItem;
    }

    search(filterDto: FilterDto) {
        return this.filterService.search<Supplier>(Supplier, filterDto);
    }

    async findOne(id: number) {
        const supplier = await this.supplierRepo.findOne(id);
        if (!supplier) {
            throw new InvalidArgumentException('Supplier not found');
        }
        return supplier;
    }

    async update(id: number, updateAsnDto: UpdateAsnDto) {
        const supplier = await this.findOne(id);

        if (updateAsnDto.openId !== supplier.openId) {
            throw new InvalidArgumentException(
                'Supplier cannot be changed. Delete this supplier and create a new one',
            );
        }

        if (updateAsnDto.supplierContact !== supplier.supplierContact) {
            throw new InvalidArgumentException(
                'Supplier cannot be changed. Delete this supplier and create a new one',
            );
        }

        // const transfer = await this.transferService.findOne(
        //     supplier.transfer.id,
        // );

        supplier.supplierName =
            updateAsnDto.supplierName || supplier.supplierName;
        supplier.supplierManager =
            updateAsnDto.supplierManager || supplier.supplierManager;
        supplier.supplierCity = updateAsnDto.supplierCity || supplier.supplierCity;
        supplier.supplierAddress = updateAsnDto.supplierAddress || supplier.supplierAddress;

        await this.em.persistAndFlush(supplier);
        return supplier;
    }

    async remove(id: number) {
        const supplier = await this.findOne(id);

        await this.em.removeAndFlush(supplier);

        return 'deleted';
    }

}
