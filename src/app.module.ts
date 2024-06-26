import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import DatabaseConfig from '../config/database.config';
import MainConfig from '../config/main.config';
import { ApiModule } from './api/api.module';
import { ResponseTransformInterceptor } from './common/interceptor/response-transform.interceptor';
import { FilterModule } from './common/module/filter/filter.module';
import { StateMachineModule } from './common/module/state-machine/state-machine.module';
// import { TestModule } from './test/test.module';
// import { GoodsBrandEntityTsModule } from './src/database/entities/goods-brand.entity.ts/goods-brand.entity.ts.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [MainConfig],
            envFilePath: ['.env'],
            isGlobal: true,
        }),
        MikroOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: DatabaseConfig,
        }),
        ApiModule,
        FilterModule,
        StateMachineModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
    ],
})
export class AppModule {}
