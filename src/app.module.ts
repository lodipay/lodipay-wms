import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ApiModule } from './api/api.module';
import DatabaseConfig from '../config/DatabaseConfig';
import MainConfig from '../config/MainConfig';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
