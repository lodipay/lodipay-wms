import { WinstonModule } from 'nest-winston';
// import { LoggerInterface } from '../logger.interface';
import { format, transports } from 'winston';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

export class WinstonFactory {
    static create(transport: string, options: DailyRotateFileTransportOptions) {
        return WinstonModule.createLogger({
            transports: [
                // same for all levels
                new transports.DailyRotateFile(
                    Object.assign(
                        {},
                        {
                            filename: 'var/logs/combined-%DATE%.log',
                            format: format.combine(
                                format.timestamp(),
                                format.json(),
                            ),
                            datePattern: 'YYYY-MM-DD',
                            zippedArchive: false,
                            maxFiles: '30d',
                        },
                        options,
                    ),
                    // aaa
                ),
            ],
        });
    }

    static supports(transport: string): boolean {
        return transport === 'winston';
    }
}
