import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { CONFIG_NAME_MAIN, MainConfig } from '../config/MainConfig';
import { LoggerFactory } from './common/factory/logger.factory';

async function bootstrap() {
  const logOptions = process.env.LOG_OPTIONS;
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory.create(
      process.env.LOG_TRANSPORT,
      logOptions ? JSON.parse(logOptions) : null,
    ),
  });
  const configService = app.get<ConfigService>(ConfigService);
  const mainConfig = configService.get(CONFIG_NAME_MAIN) as MainConfig;

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v1',
  });

  const config = new DocumentBuilder()
    .setTitle('Lodi WHS')
    .setDescription('Lodi warehouse system')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = 'swagger';
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(process.env.WHS_PORT);
  console.log(
    `Lodi WHS project is running on: http://0.0.0.0:${mainConfig.port}`,
  );
  console.log(`Swagger path: http://0.0.0.0:${mainConfig.port}/${swaggerPath}`);
}
bootstrap();
