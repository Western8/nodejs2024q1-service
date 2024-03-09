import { Logger, LoggerService } from '@nestjs/common';

export class CustomLogger implements LoggerService {

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(`(CUSTOM log) ${message}`);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    console.error(message);
  }

  /**
   * Write an 'error' level log.
  */
  error(message: any, ...optionalParams: any[]) {
    console.error(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.error(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.error(message);
  }


  /*
    error(message: any, stack?: string, context?: string) {
      super.error(message, stack, context);
      //super.error(...arguments);
    }
    */
}