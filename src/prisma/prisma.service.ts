import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma conectado ao Supabase!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma desconectado do Supabase!');
  }

  // Helper para limpar banco em testes
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Não é permitido limpar banco em produção!');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key !== 'constructor'
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as string];
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
      })
    );
  }
}