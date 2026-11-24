import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './globalErrorHandler';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
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

  // const allowedOrigins = [process.env.CLIENT_URL1, process.env.CLIENT_URL2];
  // const allowedOrigins = [process.env.CLIENT_URL1];

  // app.enableCors({
  //   origin: (origin, callback) => {
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true,
  // });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
