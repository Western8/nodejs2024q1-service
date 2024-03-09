import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/exception')
  testException() {
    throw new Error('Test uncaught exception');
  }

  @Get('test/rejection')
  testRejection() {
    throw new Error('Test unhandled rejection');
  }
}
