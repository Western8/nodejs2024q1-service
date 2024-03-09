import { Injectable, NestMiddleware, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger();

  use(req: Request, res: Response, next: Function) {

    //const urlSearchParams = new URLSearchParams(req.url);
    //logo
    //const params = Object.fromEntries(urlSearchParams.entries());

    const logReq = {
      url: req.url,
    //  headers: req.headers,
      body: req.body,
      queryParams: req.query.params,
      params: req.params,
    };
    this.logger.log(`request: ${JSON.stringify(logReq)}`);
    //console.log('before req.statusCode', res.statusCode);

    
/*
    console.log('11111111111 res', req);
    console.log('22222222222 res', res);
    
    res.end(() => {
      console.log('req.statusCode', res.statusCode);
    });
    
    
    */
    res.on('close', () => {
      this.logger.log(`response: statusCode ${res.statusCode}`);
      //console.log('after req.statusCode', res.statusCode);
    });
    

    // Getting the response log
    //getResponseLog(res);

    if (next) {
        next();
      }
  }
}
