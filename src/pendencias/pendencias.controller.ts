import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PendenciasService } from './pendencias.service';
import { CriarPendenciaDto } from './dto/criar-pendencia.dto';
import { AtualizarPendenciaDto } from './dto/atualizar-pendencia.dto';

@Controller('pendencias')
@UseGuards(JwtAuthGuard)
export class PendenciasController {
  constructor(private pendenciasService: PendenciasService) {}

  @Post()
  criar(@Request() req, @Body() dto: CriarPendenciaDto) {
    return this.pendenciasService.criar(req.user.sub, dto);
  }

  @Get()
  listar(@Request() req) {
    return this.pendenciasService.listar(req.user.sub);
  }

  @Get(':id')
  buscar(@Request() req, @Param('id') id: string) {
    return this.pendenciasService.buscarPorId(id, req.user.sub);
  }

  @Put(':id')
  atualizar(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: AtualizarPendenciaDto
  ) {
    return this.pendenciasService.atualizar(id, req.user.sub, dto);
  }

  @Delete(':id')
  deletar(@Request() req, @Param('id') id: string) {
    return this.pendenciasService.deletar(id, req.user.sub);
  }

  @Post(':id/concluir')
  concluir(@Request() req, @Param('id') id: string) {
    return this.pendenciasService.marcarConcluida(id, req.user.sub);
  }
}
