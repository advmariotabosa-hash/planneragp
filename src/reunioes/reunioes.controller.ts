import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReunioesService } from './reunioes.service';
import { CriarReuniaoDto } from './dto/criar-reuniao.dto';
import { AtualizarReuniaoDto } from './dto/atualizar-reuniao.dto';

@Controller('reunioes')
@UseGuards(JwtAuthGuard)
export class ReunioesController {
  constructor(private reunioesService: ReunioesService) {}

  @Post()
  criar(@Request() req, @Body() dto: CriarReuniaoDto) {
    return this.reunioesService.criar(
      req.user.sub,
      req.user.organizacaoId,
      dto
    );
  }

  @Get()
  listar(@Request() req) {
    return this.reunioesService.listar(req.user.organizacaoId);
  }

  @Get(':id')
  buscar(@Request() req, @Param('id') id: string) {
    return this.reunioesService.buscarPorId(id, req.user.organizacaoId);
  }

  @Put(':id')
  atualizar(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: AtualizarReuniaoDto
  ) {
    return this.reunioesService.atualizar(
      id,
      req.user.organizacaoId,
      req.user.sub,
      dto
    );
  }

  @Delete(':id')
  deletar(@Request() req, @Param('id') id: string) {
    return this.reunioesService.deletar(
      id,
      req.user.organizacaoId,
      req.user.sub
    );
  }

  @Post(':id/participantes')
  adicionarParticipantes(
    @Param('id') id: string,
    @Body('usuarios_ids') usuariosIds: string[]
  ) {
    return this.reunioesService.adicionarParticipantes(id, usuariosIds);
  }

  @Post(':id/confirmar')
  confirmar(@Request() req, @Param('id') id: string) {
    return this.reunioesService.confirmarPresenca(id, req.user.sub);
  }
}
