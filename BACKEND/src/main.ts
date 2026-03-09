import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  const corsOrigins = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  // Support multiple origins separated by comma
  const configuredOrigins = corsOrigins
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set(configuredOrigins);
  const wildcardOrigins = configuredOrigins.filter(origin => origin.startsWith('*.'));

  // Add production domains if not present
  const productionDomains = [
    'https://tsniout-shop.fr',
    'https://www.tsniout-shop.fr',
    'https://tsniout.vercel.app',
    'https://vanille-nosybe.fr',
    'https://www.vanille-nosybe.fr',
    'https://vanille-nosybe.vercel.app'
  ];

  productionDomains.forEach(domain => allowedOrigins.add(domain));

  const matchesWildcard = (origin: string) => {
    try {
      const { hostname } = new URL(origin);
      return wildcardOrigins.some(pattern => hostname.endsWith(pattern.slice(2)));
    } catch {
      return false;
    }
  };

  const isAllowedOrigin = (origin: string) => {
    if (allowedOrigins.has('*') || allowedOrigins.has(origin)) {
      return true;
    }

    if (matchesWildcard(origin)) {
      return true;
    }

    try {
      const { hostname } = new URL(origin);
      // Allow Vercel preview/prod domains by default
      if (hostname.endsWith('.vercel.app')) {
        return true;
      }
    } catch {
      return false;
    }

    return false;
  };

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        // Return "not allowed" without throwing noisy server errors
        callback(null, false);
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('Professional e-commerce backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Admin - Products')
    .addTag('Storefront')
    .addTag('Cart')
    .addTag('Orders')
    .addTag('Admin - Analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap();
