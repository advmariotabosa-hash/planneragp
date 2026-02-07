import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração CORS completa
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 PlannerAGP v2.1 rodando na porta: ${port}`);
  console.log(`📊 Banco de dados: Conectado via Prisma`);
  console.log(`🔐 Autenticação: JWT ativa`);
}

bootstrap();
```

---

## 📍 AGORA:

### **1. No GitHub, edite o arquivo `main.ts`**

### **2. APAGUE TODO o conteúdo atual**

### **3. COLE este código completo**

### **4. Commit com mensagem:**
```
fix: corrige CORS completamente
