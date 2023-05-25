import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { CONFIG_NAME_MAIN, MainConfig } from '../config/main.config';
import { FilterDto } from './common/dto/filter.dto';
import { GenericResponseDto } from './common/dto/generic-response.dto';
import { PaginatedDto } from './common/dto/paginated.dto';
import { QueryDto } from './common/dto/query.dto';
import { LoggerFactory } from './common/factory/logger.factory';
import { BaseExceptionFilter } from './common/filter/base.exception.filter';

async function bootstrap() {
    const logOptions = process.env.LOG_OPTIONS;
    const app = await NestFactory.create(AppModule, {
        logger: LoggerFactory.create(
            process.env.LOG_TRANSPORT,
            logOptions ? JSON.parse(logOptions) : null,
        ),
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    app.useGlobalFilters(new BaseExceptionFilter());

    const configService = app.get<ConfigService>(ConfigService);
    const mainConfig = configService.get(CONFIG_NAME_MAIN) as MainConfig;

    app.enableVersioning({
        type: VersioningType.URI,
        prefix: 'v1',
    });
    app.setGlobalPrefix('v1');

    const config = new DocumentBuilder()
        .setTitle('Lodi WHS')
        .setDescription('Lodi warehouse system')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [GenericResponseDto, PaginatedDto, FilterDto, QueryDto],
    });
    const swaggerPath = 'swagger';
    SwaggerModule.setup(swaggerPath, app, document);

    await app.listen(process.env.WHS_PORT);
    console.log(
        `Lodi WHS project is running on: http://0.0.0.0:${mainConfig.port}`,
    );
    console.log(
        `Swagger path: http://0.0.0.0:${mainConfig.port}/${swaggerPath}`,
    );
}
bootstrap();
