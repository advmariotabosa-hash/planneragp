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
        titulo: dto.titulo,
        descricao: dto.descricao,
        tipo: dto.tipo,
        dt_inicio: new Date(dto.dt_inicio),
        dt_fim: dto.dt_fim ? new Date(dto.dt_fim) : null,
        localizacao: dto.localizacao,
        link_videochamada: dto.link_videochamada,
        id_organizacao: organizacaoId,
        id_criador: usuarioId,
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
        id_organizacao: organizacaoId,
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
        },
        pautas: {
          select: {
            id_pauta: true,
            titulo: true,
            numero_ordem: true,
            concluida: true,
          },
          orderBy: {
            numero_ordem: 'asc'
          }
        }
      },
      orderBy: {
        dt_inicio: 'desc'
      }
    });
  }

  async buscarPorId(id: string, organizacaoId: string) {
    const reuniao = await this.prisma.tB_REUNIAO.findFirst({
      where: {
        id_reuniao: id,
        id_organizacao: organizacaoId,
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
        },
        pautas: {
          include: {
            criador: {
              select: {
                id_usuario: true,
                nome: true,
              }
            }
          },
          orderBy: {
            numero_ordem: 'asc'
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

    if (reuniao.id_criador !== usuarioId) {
      throw new ForbiddenException('Apenas o criador pode atualizar a reunião');
    }

    return this.prisma.tB_REUNIAO.update({
      where: { id_reuniao: id },
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        tipo: dto.tipo,
        dt_inicio: dto.dt_inicio ? new Date(dto.dt_inicio) : undefined,
        dt_fim: dto.dt_fim ? new Date(dto.dt_fim) : undefined,
        localizacao: dto.localizacao,
        link_videochamada: dto.link_videochamada,
        status: dto.status,
      }
    });
  }

  async deletar(id: string, organizacaoId: string, usuarioId: string) {
    const reuniao = await this.buscarPorId(id, organizacaoId);

    if (reuniao.id_criador !== usuarioId) {
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
      confirmado: false,
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
      where: { id_participante: participante.id_participante },
      data: {
        confirmado: true,
        dt_confirmacao: new Date(),
      }
    });
  }
}
