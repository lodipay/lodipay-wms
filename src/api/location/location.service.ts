import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Location } from '../../database/entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private readonly locationRepository: EntityRepository<Location>,

    private readonly em: EntityManager,
  ) {}

  async create({ code, warehouse, description }: CreateLocationDto) {
    const location = new Location(code, warehouse, description);

    return await this.locationRepository.upsert(location);
  }

  async findAll() {
    return await this.locationRepository.findAll();
  }

  async findOne(id: number) {
    return await this.locationRepository.findOne({
      id,
    });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.findOne(id);
    this.em.assign(location, updateLocationDto, { mergeObjects: true });

    await this.em.persistAndFlush(location);
    return location;
  }

  async remove(id: number) {
    const location = await this.findOne(id);

    if (location) {
      await this.em.removeAndFlush(location);
    }

    return 'success';
  }
}
