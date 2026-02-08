import { Module } from '@nestjs/common';
import { PendenciasController } from './pendencias.controller';
import { PendenciasService } from './pendencias.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PendenciasController],
  providers: [PendenciasService],
  exports: [PendenciasService],
})
export class PendenciasModule {}
