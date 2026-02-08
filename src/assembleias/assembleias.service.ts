import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarAssembleiaDto } from './dto/criar-assembleia.dto';
import { CriarVotacaoDto } from './dto/criar-votacao.dto';

@Injectable()
export class AssembleiasService {
  constructor(private prisma: PrismaService) {}

  async criar(usuarioId: string, dto: CriarAssembleiaDto) {
    const dataExpiracao = new Date(dto.data_assembleia);
    dataExpiracao.setDate(dataExpiracao.getDate() + 7);

    return this.prisma.tB_ASSEMBLEIA_AVULSA.create({
      data: {
        nome_organizacao: dto.nome_organizacao,
        email_contato: dto.email_contato,
        data_assembleia: new Date(dto.data_assembleia),
        max_participantes: dto.max_participantes,
        valor_pago: 0,
        status: 'ativa',
        data_expiracao: dataExpiracao,
        pauta_assembleia: dto.pauta_assembleia,
        criador_id: usuarioId,
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
  }

  async listar(usuarioId: string) {
    return this.prisma.tB_ASSEMBLEIA_AVULSA.findMany({
      where: {
        criador_id: usuarioId,
      },
      include: {
        participantes: true,
        votacoes: true,
      },
      orderBy: {
        data_assembleia: 'desc'
      }
    });
  }

  async buscarPorId(id: string) {
    const assembleia = await this.prisma.tB_ASSEMBLEIA_AVULSA.findUnique({
      where: { id },
      include: {
        criador: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          }
        },
        participantes: true,
        votacoes: {
          include: {
            votos: {
              include: {
                participante: true
              }
            }
          }
        },
        pautas: true
      }
    });

    if (!assembleia) {
      throw new NotFoundException('Assembleia não encontrada');
    }

    return assembleia;
  }

  async adicionarParticipante(assembleiaId: string, nome: string, email: string) {
    const assembleia = await this.buscarPorId(assembleiaId);

    if (assembleia.num_participantes >= assembleia.max_participantes) {
      throw new BadRequestException('Limite de participantes atingido');
    }

    const participante = await this.prisma.tB_PARTICIPANTE_ASSEMBLEIA.create({
      data: {
        assembleia_id: assembleiaId,
        nome,
        email,
      }
    });

    await this.prisma.tB_ASSEMBLEIA_AVULSA.update({
      where: { id: assembleiaId },
      data: {
        num_participantes: {
          increment: 1
        }
      }
    });

    return participante;
  }

  async criarVotacao(dto: CriarVotacaoDto) {
    const assembleia = await this.buscarPorId(dto.assembleia_id);

    return this.prisma.tB_VOTACAO_ASSEMBLEIA.create({
      data: {
        assembleia_id: dto.assembleia_id,
        titulo: dto.titulo,
        descricao: dto.descricao,
        opcoes: dto.opcoes,
        ativa: true,
      }
    });
  }

  async votar(votacaoId: string, participanteId: string, opcaoEscolhida: string) {
    const votacao = await this.prisma.tB_VOTACAO_ASSEMBLEIA.findUnique({
      where: { id: votacaoId },
    });

    if (!votacao) {
      throw new NotFoundException('Votação não encontrada');
    }

    if (!votacao.ativa) {
      throw new BadRequestException('Votação encerrada');
    }

    if (!votacao.opcoes.includes(opcaoEscolhida)) {
      throw new BadRequestException('Opção inválida');
    }

    const votoExistente = await this.prisma.tB_VOTO_ASSEMBLEIA.findFirst({
      where: {
        votacao_id: votacaoId,
        participante_id: participanteId,
      }
    });

    if (votoExistente) {
      throw new BadRequestException('Participante já votou nesta votação');
    }

    return this.prisma.tB_VOTO_ASSEMBLEIA.create({
      data: {
        votacao_id: votacaoId,
        participante_id: participanteId,
        opcao_escolhida: opcaoEscolhida,
      }
    });
  }

  async encerrarVotacao(votacaoId: string) {
    return this.prisma.tB_VOTACAO_ASSEMBLEIA.update({
      where: { id: votacaoId },
      data: {
        ativa: false,
        encerrada_em: new Date(),
      }
    });
  }

  async resultadoVotacao(votacaoId: string) {
    const votacao = await this.prisma.tB_VOTACAO_ASSEMBLEIA.findUnique({
      where: { id: votacaoId },
      include: {
        votos: true
      }
    });

    if (!votacao) {
      throw new NotFoundException('Votação não encontrada');
    }

    const resultado = votacao.opcoes.map(opcao => ({
      opcao,
      votos: votacao.votos.filter(v => v.opcao_escolhida === opcao).length
    }));

    return {
      votacao_id: votacao.id,
      titulo: votacao.titulo,
      total_votos: votacao.votos.length,
      ativa: votacao.ativa,
      resultado
    };
  }
}
