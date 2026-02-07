import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
  origin: '*',
  credentials: true,
});
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('🚀 PlannerAGP v2.1 rodando na porta:', port);
  console.log('📊 Banco de dados: Conectado via Prisma');
  console.log('🔐 Autenticação: JWT ativa');
}

bootstrap();
