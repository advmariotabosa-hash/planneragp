import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarReuniaoDto } from './dto/criar-reuniao.dto';
import { AtualizarReuniaoDto } from './dto/atualizar-reuniao.dto';

@Injectable()
export class ReunioesService {
  constructor(private prisma: PrismaService) {}

  async criar(usuarioId: string, organizacaoId: string, dto: CriarReuniaoDto) {
    const reuniao = await this.prisma.tB_REUNIAO.create({
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        tipo: dto.tipo,
        data_hora_inicio: new Date(dto.data_hora_inicio),
        data_hora_fim: dto.data_hora_fim ? new Date(dto.data_hora_fim) : null,
        local: dto.local,
        link_reuniao: dto.link_reuniao,
        organizacao_id: organizacaoId,
        criador_id: usuarioId,
        status: 'AGENDADA',
      },
      include: {
        criador: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        }
      }
    });

    if (dto.participantes && dto.participantes.length > 0) {
      await this.adicionarParticipantes(reuniao.id_reuniao, dto.participantes);
    }

    return reuniao;
  }

  async listar(organizacaoId: string) {
    return this.prisma.tB_REUNIAO.findMany({
      where: {
        organizacao_id: organizacaoId,
      },
      include: {
        criador: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        participantes: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nome: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        data_hora_inicio: 'desc'
      }
    });
  }

  async buscarPorId(id: string, organizacaoId: string) {
    const reuniao = await this.prisma.tB_REUNIAO.findFirst({
      where: {
        id_reuniao: id,
        organizacao_id: organizacaoId,
      },
      include: {
        criador: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        participantes: {
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nome: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!reuniao) {
      throw new NotFoundException('Reunião não encontrada');
    }

    return reuniao;
  }

  async atualizar(id: string, organizacaoId: string, usuarioId: string, dto: AtualizarReuniaoDto) {
    const reuniao = await this.buscarPorId(id, organizacaoId);

    if (reuniao.criador_id !== usuarioId) {
      throw new ForbiddenException('Apenas o criador pode atualizar a reunião');
    }

    return this.prisma.tB_REUNIAO.update({
      where: { id_reuniao: id },
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        tipo: dto.tipo,
        data_hora_inicio: dto.data_hora_inicio ? new Date(dto.data_hora_inicio) : undefined,
        data_hora_fim: dto.data_hora_fim ? new Date(dto.data_hora_fim) : undefined,
        local: dto.local,
        link_reuniao: dto.link_reuniao,
        status: dto.status,
      }
    });
  }

  async deletar(id: string, organizacaoId: string, usuarioId: string) {
    const reuniao = await this.buscarPorId(id, organizacaoId);

    if (reuniao.criador_id !== usuarioId) {
      throw new ForbiddenException('Apenas o criador pode deletar a reunião');
    }

    await this.prisma.tB_REUNIAO.delete({
      where: { id_reuniao: id }
    });

    return { message: 'Reunião deletada com sucesso' };
  }

  async adicionarParticipantes(reuniaoId: string, usuariosIds: string[]) {
    const participantes = usuariosIds.map(usuarioId => ({
      id_reuniao: reuniaoId,
      id_usuario: usuarioId,
    }));

    await this.prisma.tB_PARTICIPANTE_REUNIAO.createMany({
      data: participantes,
      skipDuplicates: true,
    });

    return { message: 'Participantes adicionados com sucesso' };
  }

  async confirmarPresenca(reuniaoId: string, usuarioId: string) {
    const participante = await this.prisma.tB_PARTICIPANTE_REUNIAO.findFirst({
      where: {
        id_reuniao: reuniaoId,
        id_usuario: usuarioId,
      }
    });

    if (!participante) {
      throw new NotFoundException('Você não está convidado para esta reunião');
    }

    return this.prisma.tB_PARTICIPANTE_REUNIAO.update({
      where: { id: participante.id },
      data: {
        presente: true,
      }
    });
  }
}
