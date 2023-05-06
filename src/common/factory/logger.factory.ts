import 'winston-daily-rotate-file';
import { WinstonFactory } from './logger/winston.factory';

const registeredFactories = [WinstonFactory];

export class LoggerFactory {
  static create(transport: string, options: object) {
    for (const factory of registeredFactories) {
      if (factory.supports(transport)) {
        return factory.create(transport, options);
      }
    }
  }
}
