import { Module } from '@nestjs/common';
import { AppController, AppControllerUser } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AppControllerUser,
  ],
  providers: [AppService],
})
export class AppModule {}
