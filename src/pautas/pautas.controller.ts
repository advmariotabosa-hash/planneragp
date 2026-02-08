import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PautasService } from './pautas.service';
import { CriarPautaDto } from './dto/criar-pauta.dto';
import { AtualizarPautaDto } from './dto/atualizar-pauta.dto';

@Controller('pautas')
@UseGuards(JwtAuthGuard)
export class PautasController {
  constructor(private pautasService: PautasService) {}

  @Post()
  criar(@Request() req, @Body() dto: CriarPautaDto) {
    return this.pautasService.criar(req.user.sub, req.user.nome, dto);
  }

  @Get('reuniao/:reuniaoId')
  listarPorReuniao(@Param('reuniaoId') reuniaoId: string) {
    return this.pautasService.listarPorReuniao(reuniaoId);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.pautasService.buscarPorId(id);
  }

  @Put(':id')
  atualizar(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: AtualizarPautaDto
  ) {
    return this.pautasService.atualizar(id, req.user.sub, dto);
  }

  @Delete(':id')
  deletar(@Request() req, @Param('id') id: string) {
    return this.pautasService.deletar(id, req.user.sub);
  }

  @Post(':id/comentarios')
  adicionarComentario(
    @Request() req,
    @Param('id') id: string,
    @Body('conteudo') conteudo: string
  ) {
    return this.pautasService.adicionarComentario(id, req.user.sub, conteudo);
  }
}
