import { Injectable, Logger, LoggerService } from '@nestjs/common';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
} from 'node:fs';

@Injectable()
export class CustomLogger implements LoggerService {
  level: number;

  constructor() {
    this.level = logLevels.indexOf(process.env.LOG_LEVEL);
    if (this.level === -1) this.level = 2;
  }

  log(message: any, ...optionalParams: any[]) {
    this.logTo(3, message);
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.logTo(0, message);
    //console.error(0, message);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logTo(1, message);
    //console.error(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logTo(2, message);
    //console.warn(message);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logTo(4, message);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logTo(5, message);
  }

  getFilename(level: number, rotate = false) {
    const dir = './logs';
    if (!existsSync(dir)) mkdirSync(dir);
    let timestamp = new Date().toISOString().substring(0, 10);
    if (rotate) {
      timestamp = new Date().toISOString().replace(/:/g, '');
    }
    return `${dir}/hsl-log-${level < 2 ? 'errors' : 'logs'}-${timestamp}.log`;
  }

  logTo(level: number, message: string) {
    if (level > this.level) return;
    const messageNew = `[${logLevels[level].toLocaleUpperCase()}] ${message}`;
    process.stdout.write(messageNew);
    this.logToFile(level, messageNew);
  }

  logToFile(level: number, message: string) {
    const filename = this.getFilename(level);
    const timestamp = new Date().toISOString();
    const logStr = `[${timestamp}] ${message}\n`;

    if (existsSync(filename)) {
      const fileSize = statSync(filename).size / 1024;
      const maxFileSize = +process.env.LOG_FILE_SIZE || 0;
      if (maxFileSize && fileSize > maxFileSize) {
        renameSync(filename, this.getFilename(level, true));
      }
    }
    appendFileSync(filename, logStr);
  }

  /*
    error(message: any, stack?: string, context?: string) {
      super.error(message, stack, context);
      //super.error(...arguments);
    }
    */
}

export const logLevels = ['fatal', 'error', 'warn', 'log', 'verbose', 'debug'];
