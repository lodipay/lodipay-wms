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
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private supplierRepo: EntityRepository<Supplier>,

        private em: EntityManager,
        private filterService: FilterService,
    ) {}

    async create(createSupplierDto: CreateSupplierDto) {
        const supplierExists = await this.supplierRepo.findOne({
            supplierContact: createSupplierDto.supplierContact,
            openId: createSupplierDto.openId,
        });

        if (supplierExists) {
            throw new InvalidArgumentException('Supplier already exists');
        }

        const supplierItem = new Supplier();
        supplierItem.supplierName = createSupplierDto.supplierName;
        supplierItem.supplierCity = createSupplierDto.supplierCity;
        supplierItem.supplierAddress = createSupplierDto.supplierAddress;
        supplierItem.isDelete = false;
        supplierItem.supplierContact = createSupplierDto.supplierContact;
        supplierItem.supplierManager = createSupplierDto.supplierManager;
        supplierItem.supplierLevel = createSupplierDto.supplierLevel;
        supplierItem.openId = createSupplierDto.openId;
        
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

    async update(id: number, updateSupplierDto: UpdateSupplierDto) {
        const supplier = await this.findOne(id);

        if (updateSupplierDto.openId !== supplier.openId) {
            throw new InvalidArgumentException(
                'Supplier cannot be changed. Delete this supplier and create a new one',
            );
        }

        if (updateSupplierDto.supplierContact !== supplier.supplierContact) {
            throw new InvalidArgumentException(
                'Supplier cannot be changed. Delete this supplier and create a new one',
            );
        }

        // const transfer = await this.transferService.findOne(
        //     supplier.transfer.id,
        // );

        supplier.supplierName =
            updateSupplierDto.supplierName || supplier.supplierName;
        supplier.supplierManager =
            updateSupplierDto.supplierManager || supplier.supplierManager;
        supplier.supplierCity = updateSupplierDto.supplierCity || supplier.supplierCity;
        supplier.supplierAddress = updateSupplierDto.supplierAddress || supplier.supplierAddress;

        await this.em.persistAndFlush(supplier);
        return supplier;
    }

    async remove(id: number) {
        const supplier = await this.findOne(id);

        await this.em.removeAndFlush(supplier);

        return 'deleted';
    }

}
