import { Injectable, NestMiddleware, Param } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger();

  use(req: Request, res: Response, next: NextFunction) {
    const logReq = {
      url: req.url,
      body: req.body,
      queryParams: req.query.params,
      params: req.params,
    };
    this.logger.log(`request: ${JSON.stringify(logReq)}`);

    res.on('close', () => {
      this.logger.log(`response: statusCode ${res.statusCode}`);
    });

    if (next) {
      next();
    }
  }
}
