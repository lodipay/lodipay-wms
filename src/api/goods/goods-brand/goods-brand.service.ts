// import {
//     HttpException,
//     Injectable,
// } from '@nestjs/common';
// import {
//     EntityRepository,
// } from '@mikro-orm/postgresql';
// import { CreateGoodsBrandDto } from './dto/create-goods-brand.dto';
// import { UpdateGoodsBrandDto } from './dto/update-goods-brand.dto';
// import { GoodsBrand } from '../../../database/entities/goods-brand.entity';
// import { InjectRepository } from '@mikro-orm/nestjs';

// @Injectable()
// export class UserService {
//     constructor(
//         @InjectRepository(GoodsBrand)
//         private readonly userRepository: EntityRepository<GoodsBrand>,
//     ) { }

//     async create(
//         createGoodsBrandDto: CreateGoodsBrandDto,
//     ): Promise<GoodsBrand> {
//         const userData =
//             await this.userRepository.create(
//                 createGoodsBrandDto,
//             );
//         return this.userRepository.save(userData);
//     }

//     async findAll(): Promise<GoodsBrand[]> {
//         return await this.userRepository.find();
//     }

//     async findOne(id: number): Promise<GoodsBrand> {
//         const userData =
//             await this.userRepository.findOneBy({ id });
//         if (!userData) {
//             throw new HttpException(
//                 'User Not Found',
//                 404,
//             );
//         }
//         return userData;
//     }

//     async update(
//         id: number,
//         updateGoodsBrandDto: UpdateGoodsBrandDto,
//     ): Promise<GoodsBrand> {
//         const existingUser = await this.findOne(id);
//         const userData = this.userRepository.merge(
//             existingUser,
//             updateGoodsBrandDto,
//         );
//         return await this.userRepository.save(
//             userData,
//         );
//     }

//     async remove(id: number): Promise<GoodsBrand> {
//         const existingUser = await this.findOne(id);
//         return await this.userRepository.remove(
//             existingUser,
//         );
//     }
// }