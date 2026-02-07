import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'PlannerAGP API v2.1 - Rodando!';
  }

  getStatus() {
    return {
      status: 'healthy',
      version: '2.1.0',
      timestamp: new Date().toISOString(),
    };
  }
}
