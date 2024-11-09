"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomLoggerService = void 0;
const winston = require("winston");
class MyCustomLoggerService {
    constructor() {
        this.errorLogger = winston.createLogger({
            level: 'error',
            format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level}: ${message}`;
            })),
            transports: [new winston.transports.File({ filename: 'logs/error.log' })],
        });
        this.accessLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level}: ${message}`;
            })),
            transports: [
                new winston.transports.File({ filename: 'logs/access.log' }),
            ],
        });
    }
    log(message) {
        this.accessLogger.info(message);
    }
    error(message, trace) {
        this.errorLogger.error(`${message} - Trace: ${trace}`);
    }
    warn(message) {
        this.accessLogger.warn(message);
    }
    debug(message) {
        this.accessLogger.debug(message);
    }
}
exports.MyCustomLoggerService = MyCustomLoggerService;
//# sourceMappingURL=logger.service.js.map