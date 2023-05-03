import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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
        `Lodi WHS project is running on: http://0.0.0.0:${process.env.WHS_PORT}`,
    );
    console.log(
        `Swagger path: http://0.0.0.0:${process.env.WHS_PORT}/${swaggerPath}`,
    );
}
bootstrap();
