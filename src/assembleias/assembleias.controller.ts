import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssembleiasService } from './assembleias.service';
import { CriarAssembleiaDto } from './dto/criar-assembleia.dto';
import { CriarVotacaoDto } from './dto/criar-votacao.dto';

@Controller('assembleias')
@UseGuards(JwtAuthGuard)
export class AssembleiasController {
  constructor(private assembleiasService: AssembleiasService) {}

  @Post()
  criar(@Request() req, @Body() dto: CriarAssembleiaDto) {
    return this.assembleiasService.criar(req.user.sub, dto);
  }

  @Get()
  listar(@Request() req) {
    return this.assembleiasService.listar(req.user.sub);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.assembleiasService.buscarPorId(id);
  }

  @Post(':id/participantes')
  adicionarParticipante(
    @Param('id') id: string,
    @Body('nome') nome: string,
    @Body('email') email: string
  ) {
    return this.assembleiasService.adicionarParticipante(id, nome, email);
  }

  @Post('votacoes')
  criarVotacao(@Body() dto: CriarVotacaoDto) {
    return this.assembleiasService.criarVotacao(dto);
  }

  @Post('votacoes/:votacaoId/votar')
  votar(
    @Param('votacaoId') votacaoId: string,
    @Body('participante_id') participanteId: string,
    @Body('opcao_escolhida') opcaoEscolhida: string
  ) {
    return this.assembleiasService.votar(votacaoId, participanteId, opcaoEscolhida);
  }

  @Post('votacoes/:votacaoId/encerrar')
  encerrar(@Param('votacaoId') votacaoId: string) {
    return this.assembleiasService.encerrarVotacao(votacaoId);
  }

  @Get('votacoes/:votacaoId/resultado')
  resultado(@Param('votacaoId') votacaoId: string) {
    return this.assembleiasService.resultadoVotacao(votacaoId);
  }
}
