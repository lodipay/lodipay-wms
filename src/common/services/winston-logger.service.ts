import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';

const winstonLoggerService = WinstonModule.createLogger({
    transports: [
        // file on daily rotation (error only)
        new transports.DailyRotateFile({
            // %DATE will be replaced by the current date
            filename: `${
                process.env.LOG_FILE_LOCATION
                    ? process.env.LOG_FILE_LOCATION
                    : 'var/logs'
            }/error-%DATE%.log`,
            level: 'error',
            format: format.combine(format.timestamp(), format.json()),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false, // don't want to zip our logs
            maxFiles: `${process.env.LOG_KEEP_DAY}d`, // will keep log until they are older than 30 days
        }),
        // same for all levels
        new transports.DailyRotateFile({
            filename: `${
                process.env.LOG_FILE_LOCATION
                    ? process.env.LOG_FILE_LOCATION
                    : 'var/logs'
            }/combined-%DATE%.log`,
            format: format.combine(format.timestamp(), format.json()),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxFiles: `${process.env.LOG_KEEP_DAY}d`,
        }),
    ],
});

export default winstonLoggerService;
