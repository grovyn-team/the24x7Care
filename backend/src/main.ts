import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const isDevelopment = configService.get<string>('NODE_ENV') !== 'production';
  const frontendUrls = configService.get<string>('FRONTEND_URLS') || 
                       configService.get<string>('FRONTEND_URL') || 
                       'http://localhost:3000';
  
  const allowedOrigins = frontendUrls.split(',').map(url => url.trim()).filter(url => url.length > 0);
  
  if (isDevelopment) {
    if (!allowedOrigins.includes('http://localhost:3000')) {
      allowedOrigins.push('http://localhost:3000');
    }
    if (!allowedOrigins.includes('http://127.0.0.1:3000')) {
      allowedOrigins.push('http://127.0.0.1:3000');
    }
  }
  
  console.log('CORS allowed origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      if (isDevelopment && !origin) {
        return callback(null, true);
      }
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (isDevelopment) {
        const isLocalNetwork = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+):\d+$/.test(origin);
        if (isLocalNetwork) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('The24x7Care API')
    .setDescription('Backend API for The24x7Care healthcare platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(`CORS configured for origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();
