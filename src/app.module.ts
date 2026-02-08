import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ReunioesModule } from './reunioes/reunioes.module';
import { PendenciasModule } from './pendencias/pendencias.module';
import { PautasModule } from './pautas/pautas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ReunioesModule,
    PendenciasModule,
    PautasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
