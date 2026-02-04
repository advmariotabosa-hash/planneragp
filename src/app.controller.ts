import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './database/supabase.service';

@Controller()
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  getHello(): string {
    return 'PlannerAGP - Aplicativo em construção';
  }

  @Get('status')
  getStatus(): object {
    return {
      status: 'online',
      versao: '1.0.0',
      aplicativo: 'PlannerAGP',
      descricao: 'Sistema de Planejamento e Execução'
    };
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }
}