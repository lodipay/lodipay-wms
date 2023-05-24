import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Lock } from '../../database/entities/lock.entity';
import { CreateLockDto } from './dto/create-lock.dto';
import { UpdateLockDto } from './dto/update-lock.dto';

@Injectable()
export class LockService {
    constructor(
        @InjectRepository(Lock)
        private readonly lockRepository: EntityRepository<Lock>,
        private readonly em: EntityManager,
    ) {}

    async create(dto: CreateLockDto): Promise<Lock> {
        const lock = new Lock(dto.reason, dto.activeFrom, dto.activeTo);

        await this.em.persistAndFlush(lock);

        return lock;
    }

    findAll(): Promise<Lock[]> {
        return this.lockRepository.findAll();
    }

    findOne(id: number): Promise<Lock> {
        return this.lockRepository.findOne({ id });
    }

    async update(id: number, updateLockDto: UpdateLockDto): Promise<Lock> {
        const lock = await this.findOne(id);
        this.em.assign(lock, updateLockDto, { mergeObjects: true });

        await this.em.persistAndFlush(lock);

        return lock;
    }

    async remove(id: number) {
        const lock = await this.findOne(id);

        if (lock) {
            await this.em.removeAndFlush(lock);
        }

        return 'success';
    }
}
