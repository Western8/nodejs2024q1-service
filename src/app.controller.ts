import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('test/exception')
  testException() {
    throw new Error('Test uncaught exception');
  }

  @Public()
  @Get('test/rejection')
  testRejection() {
    throw new Error('Test unhandled rejection');
  }
}
