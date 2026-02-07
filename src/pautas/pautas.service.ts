import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarPautaDto } from './dto/criar-pauta.dto';
import { AtualizarPautaDto } from './dto/atualizar-pauta.dto';

@Injectable()
export class PautasService {
  constructor(private prisma: PrismaService) {}

  async criar(usuarioId: string, usuarioNome: string, dto: CriarPautaDto) {
    const reuniao = await this.prisma.tB_REUNIAO.findUnique({
      where: { id_reuniao: dto.id_reuniao },
    });

    if (!reuniao) {
      throw new NotFoundException('Reunião não encontrada');
    }

    return this.prisma.tB_PAUTA.create({
      data: {
        id_reuniao: dto.id_reuniao,
        titulo: dto.titulo,
        conteudo: dto.conteudo,
        anexos: dto.anexos || [],
        autor_id: usuarioId,
        autor_nome: usuarioNome,
      },
      include: {
        autor: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        reuniao: {
          select: {
            id_reuniao: true,
            nome: true,
          }
        }
      }
    });
  }

  async listarPorReuniao(reuniaoId: string) {
    return this.prisma.tB_PAUTA.findMany({
      where: {
        id_reuniao: reuniaoId,
      },
      include: {
        autor: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        comentarios: {
          include: {
            autor: {
              select: {
                id_usuario: true,
                nome: true,
              }
            }
          },
          orderBy: {
            data: 'asc'
          }
        }
      },
      orderBy: {
        data_registro: 'asc'
      }
    });
  }

  async buscarPorId(id: string) {
    const pauta = await this.prisma.tB_PAUTA.findUnique({
      where: { id_pauta: id },
      include: {
        autor: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        reuniao: {
          select: {
            id_reuniao: true,
            nome: true,
          }
        },
        comentarios: {
          include: {
            autor: {
              select: {
                id_usuario: true,
                nome: true,
              }
            }
          },
          orderBy: {
            data: 'asc'
          }
        },
        pendencias: true
      }
    });

    if (!pauta) {
      throw new NotFoundException('Pauta não encontrada');
    }

    return pauta;
  }

  async atualizar(id: string, usuarioId: string, dto: AtualizarPautaDto) {
    const pauta = await this.buscarPorId(id);

    if (pauta.autor_id !== usuarioId) {
      throw new ForbiddenException('Apenas o autor pode atualizar esta pauta');
    }

    return this.prisma.tB_PAUTA.update({
      where: { id_pauta: id },
      data: {
        titulo: dto.titulo,
        conteudo: dto.conteudo,
        anexos: dto.anexos,
      }
    });
  }

  async deletar(id: string, usuarioId: string) {
    const pauta = await this.buscarPorId(id);

    if (pauta.autor_id !== usuarioId) {
      throw new ForbiddenException('Apenas o autor pode deletar esta pauta');
    }

    await this.prisma.tB_PAUTA.delete({
      where: { id_pauta: id }
    });

    return { message: 'Pauta deletada com sucesso' };
  }

  async adicionarComentario(pautaId: string, usuarioId: string, conteudo: string) {
    const pauta = await this.buscarPorId(pautaId);

    return this.prisma.tB_COMENTARIO.create({
      data: {
        id_pauta: pautaId,
        autor_id: usuarioId,
        conteudo,
      },
      include: {
        autor: {
          select: {
            id_usuario: true,
            nome: true,
          }
        }
      }
    });
  }
}
