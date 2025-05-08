// src/middleware/RateLimiter.ts
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class RateLimiter {
  private loginLimiter: RateLimitRequestHandler;
  private generalLimiter: RateLimitRequestHandler;

  constructor() {
    this.loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, 
      max: 2,
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true,
      handler: (req: Request, res: Response) => {
        logger.error(`reintendo desde el IP: ${req.ip}`);
        return res.status(429).json({
          status: 'error',
          message: 'demasiados intentos'
        });
      }
    });

    this.generalLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 2, 
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response) => {
        logger.error(`demasiadas peticiones IP: ${req.ip}, ruta: ${req.originalUrl}`);
        return res.status(429).json({
          status: 'error',
          message: 'demasiados intentoss.'
        });
      }
    });
  }

  applyLoginLimit(): (req: Request, res: Response, next: NextFunction) => void {
    return this.loginLimiter;
  }

  applyGeneralLimit(): (req: Request, res: Response, next: NextFunction) => void {
    return this.generalLimiter;
  }
}

export const rateLimiter = new RateLimiter();