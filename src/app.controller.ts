import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
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