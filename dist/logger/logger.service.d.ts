import { LoggerService as NestLoggerService } from '@nestjs/common';
export declare class MyCustomLoggerService implements NestLoggerService {
    private errorLogger;
    private accessLogger;
    constructor();
    log(message: string): void;
    error(message: string, trace: string): void;
    warn(message: string): void;
    debug(message: string): void;
}
