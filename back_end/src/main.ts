import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './globalErrorHandler';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ChatWsService } from './WS_Chat2/ChatWsService';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      transform: true,
    }),
  );

  const server = app.getHttpServer();
  const wsServer = app.get(ChatWsService);
  wsServer.setServer(server);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(cookieParser());

  app.use(morgan('dev'));

  app.use(json());

  const allowedOrigins = [process.env.FRONT_END_URL, 'http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
