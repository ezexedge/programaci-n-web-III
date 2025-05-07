import morgan, { StreamOptions } from 'morgan';
import * as winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export class Logger {
  private logger: winston.Logger;

  constructor() {
    const formats = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    );

    this.logger = winston.createLogger({
      format: formats,
      transports: [
        new winston.transports.File({ 
          filename: path.join(logDir, 'error.log'), 
          level: 'error' 
        }),
        new winston.transports.File({ 
          filename: path.join(logDir, 'info.log'),
          level: 'info'
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            formats
          ),
        })
      ],
    });
  }

  error(message: string): void {
    this.logger.error(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  stream(): StreamOptions {
    return {
      write: (message: string) => {
        this.info(message.trim());
      }
    };
  }

  logAccess(): (req: Request, res: Response, next: NextFunction) => void {
    return morgan('combined', { stream: this.stream() });
  }
}

export const logger = new Logger();