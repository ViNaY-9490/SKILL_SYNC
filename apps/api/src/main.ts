import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  let port = configService.get<number>('PORT', 4000);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: configService.get('APP_ENV') === 'production',
  }));
  app.use(compression());
  app.use(cookieParser());

  // CORS — allow frontend origins
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // API versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // OpenAPI / Swagger
  if (configService.get('APP_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('SkillSync API')
      .setDescription('Academia–Industry Skill Intelligence Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('refresh_token')
      .addTag('auth', 'Authentication & authorization')
      .addTag('users', 'User management')
      .addTag('students', 'Student profiles & skill data')
      .addTag('skills', 'Skill taxonomy & graph')
      .addTag('opportunities', 'Opportunities (jobs, internships, projects)')
      .addTag('applications', 'Application lifecycle management')
      .addTag('assessments', 'Skill assessments')
      .addTag('recommendations', 'AI-powered recommendations')
      .addTag('organizations', 'Industry organizations')
      .addTag('institutions', 'Academic institutions')
      .addTag('analytics', 'Platform analytics & dashboards')
      .addTag('notifications', 'In-app notifications')
      .addTag('documents', 'Document management & AI processing')
      .addTag('admin', 'Platform administration')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // Handle port fallback if 4000 is occupied
  let started = false;
  while (!started && port < 4010) {
    try {
      await app.listen(port);
      started = true;
      console.log(`🚀 SkillSync API running on http://localhost:${port}/api`);
      console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
    } catch (err: any) {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
        port++;
      } else {
        throw err;
      }
    }
  }
}

bootstrap();
