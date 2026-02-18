import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins: (string | RegExp)[] = [
    'http://localhost:3000',
    'http://localhost:3001',
    /\.vercel\.app$/,
    /\.pages\.dev$/,
  ];

  // Add custom origins from CORS_ORIGINS env var (comma-separated)
  const extraOrigins = process.env.CORS_ORIGINS;
  if (extraOrigins) {
    extraOrigins.split(',').forEach((o) => corsOrigins.push(o.trim()));
  }

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Zikora server running on http://localhost:${port}`);
}
bootstrap();
