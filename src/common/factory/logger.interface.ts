import { LoggerService, LogLevel } from '@nestjs/common';

export interface LoggerInterface {
    create(transport: string, options): LoggerService | boolean | LogLevel;
    supports(transport: string): boolean;
}
