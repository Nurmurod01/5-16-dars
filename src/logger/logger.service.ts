import { LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

export class MyCustomLoggerService implements NestLoggerService {
  private errorLogger: winston.Logger;
  private accessLogger: winston.Logger;

  constructor() {
    this.errorLogger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
      transports: [new winston.transports.File({ filename: 'logs/error.log' })],
    });

    this.accessLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/access.log' }),
      ],
    });
  }

  log(message: string) {
    this.accessLogger.info(message);
  }

  error(message: string, trace: string) {
    this.errorLogger.error(`${message} - Trace: ${trace}`);
  }

  warn(message: string) {
    this.accessLogger.warn(message);
  }

  debug(message: string) {
    this.accessLogger.debug(message);
  }
}
