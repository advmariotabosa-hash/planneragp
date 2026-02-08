import { Module } from '@nestjs/common';
import { AssembleiasController } from './assembleias.controller';
import { AssembleiasService } from './assembleias.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssembleiasController],
  providers: [AssembleiasService],
  exports: [AssembleiasService],
})
export class AssembleiasModule {}
