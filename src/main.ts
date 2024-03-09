import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import 'dotenv/config';
import './utils/polyfill';
import { CustomLogger } from './logger/logger.service';
import { AllExceptionsFilter } from './exception/exception.filter';

const port: number =
  process.env.PORT && Number.isInteger(+process.env.PORT)
    ? +process.env.PORT
    : 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new CustomLogger(),
    //bufferLogs: true,
  });
  //app.useLogger(app.get(CustomLogger));
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  /* 
    const config = new DocumentBuilder()
      .setTitle('Home library service API')
      .setDescription('API description for nest.js/service')
      .setVersion('1.0')
      //.addTag('lib')
      .build();
    const document = SwaggerModule.createDocument(app, config);
  */
  const document = YAML.load('./doc/api.yaml');
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);
}
bootstrap();
