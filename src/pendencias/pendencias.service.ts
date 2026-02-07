import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarPendenciaDto } from './dto/criar-pendencia.dto';
import { AtualizarPendenciaDto } from './dto/atualizar-pendencia.dto';

@Injectable()
export class PendenciasService {
  constructor(private prisma: PrismaService) {}

  async criar(usuarioId: string, dto: CriarPendenciaDto) {
    const pauta = await this.prisma.tB_PAUTA.findUnique({
      where: { id_pauta: dto.id_pauta },
    });

    if (!pauta) {
      throw new NotFoundException('Pauta não encontrada');
    }

    return this.prisma.tB_PENDENCIA.create({
      data: {
        id_pauta: dto.id_pauta,
        titulo: dto.titulo,
        responsavel_id: dto.responsavel_id,
        prazo: new Date(dto.prazo),
        status: 'pendente',
      },
      include: {
        responsavel: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        pauta: {
          select: {
            id_pauta: true,
            titulo: true,
          }
        }
      }
    });
  }

  async listar(usuarioId: string) {
    return this.prisma.tB_PENDENCIA.findMany({
      where: {
        responsavel_id: usuarioId,
      },
      include: {
        responsavel: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        pauta: {
          select: {
            id_pauta: true,
            titulo: true,
          }
        }
      },
      orderBy: {
        prazo: 'asc'
      }
    });
  }

  async buscarPorId(id: string, usuarioId: string) {
    const pendencia = await this.prisma.tB_PENDENCIA.findUnique({
      where: { id_pendencia: id },
      include: {
        responsavel: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        pauta: {
          select: {
            id_pauta: true,
            titulo: true,
          }
        }
      }
    });

    if (!pendencia) {
      throw new NotFoundException('Pendência não encontrada');
    }

    return pendencia;
  }

  async atualizar(id: string, usuarioId: string, dto: AtualizarPendenciaDto) {
    const pendencia = await this.buscarPorId(id, usuarioId);

    if (pendencia.responsavel_id !== usuarioId) {
      throw new ForbiddenException('Apenas o responsável pode atualizar esta pendência');
    }

    return this.prisma.tB_PENDENCIA.update({
      where: { id_pendencia: id },
      data: {
        titulo: dto.titulo,
        responsavel_id: dto.responsavel_id,
        prazo: dto.prazo ? new Date(dto.prazo) : undefined,
        status: dto.status,
      },
      include: {
        responsavel: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        }
      }
    });
  }

  async deletar(id: string, usuarioId: string) {
    const pendencia = await this.buscarPorId(id, usuarioId);

    if (pendencia.responsavel_id !== usuarioId) {
      throw new ForbiddenException('Apenas o responsável pode deletar esta pendência');
    }

    await this.prisma.tB_PENDENCIA.delete({
      where: { id_pendencia: id }
    });

    return { message: 'Pendência deletada com sucesso' };
  }

  async marcarConcluida(id: string, usuarioId: string) {
    const pendencia = await this.buscarPorId(id, usuarioId);

    if (pendencia.responsavel_id !== usuarioId) {
      throw new ForbiddenException('Apenas o responsável pode concluir esta pendência');
    }

    return this.prisma.tB_PENDENCIA.update({
      where: { id_pendencia: id },
      data: { status: 'concluida' }
    });
  }
}
