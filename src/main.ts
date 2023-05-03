import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [
                // file on daily rotation (error only)
                new transports.DailyRotateFile({
                    // %DATE will be replaced by the current date
                    filename: `logs/%DATE%-error.log`,
                    level: 'error',
                    format: format.combine(format.timestamp(), format.json()),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false, // don't want to zip our logs
                    maxFiles: '30d', // will keep log until they are older than 30 days
                }),
                // same for all levels
                new transports.DailyRotateFile({
                    filename: `logs/%DATE%-combined.log`,
                    format: format.combine(format.timestamp(), format.json()),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxFiles: '30d',
                }),
                new transports.Console({
                    format: format.combine(
                        format.cli(),
                        format.splat(),
                        format.timestamp(),
                        format.printf((info) => {
                            return `${info.timestamp} ${info.level}: ${info.message}`;
                        }),
                    ),
                }),
            ],
        }),
    });
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
