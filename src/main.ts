import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import 'dotenv/config';
import './utils/polyfill';
import { CustomLogger } from './logger/logger.service';
import { AllExceptionsFilter } from './logger/exception.filter';

const port: number =
  process.env.PORT && Number.isInteger(+process.env.PORT)
    ? +process.env.PORT
    : 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //logger: new CustomLogger(),
    //bufferLogs: true,
  });
  //app.useLogger(app.get(CustomLogger));
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  const logger = new CustomLogger();

  const document = YAML.load('./doc/api.yaml');
  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', (error) => {
    logger.fatal(`Uncaught exception! ${error}. App stopped.`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.warn(`unhandled rejection! ${reason}`);
  });

  await app.listen(port);
}
bootstrap();
