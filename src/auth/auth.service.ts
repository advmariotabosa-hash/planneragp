import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { nome, email, senha, nome_organizacao, codigo_indicacao } = registerDto;

    const emailExistente = await this.prisma.tB_USUARIO.findUnique({
      where: { email },
    });

    if (emailExistente) {
      throw new ConflictException('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const codigoIndicacaoGerado = `PLANEX-${uuidv4().substring(0, 8).toUpperCase()}`;

    let indicadorId: string | null = null;
    if (codigo_indicacao) {
      const indicador = await this.prisma.tB_USUARIO.findUnique({
        where: { codigo_indicacao },
      });

      if (!indicador) {
        throw new BadRequestException('Código de indicação inválido');
      }

      indicadorId = indicador.id_usuario;
    }

    const resultado = await this.prisma.$transaction(async (tx) => {
      const usuario = await tx.tB_USUARIO.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          tipo: 'master',
          codigo_indicacao: codigoIndicacaoGerado,
          indicado_por: indicadorId,
          email_verificado: true,
          trial_ativo: true,
          trial_expira_em: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });

      const organizacao = await tx.tB_ORGANIZACAO.create({
        data: {
          nome: nome_organizacao,
          id_master: usuario.id_usuario,
          plano_tipo: 'trial',
          limite_usuarios: 5,
          usuarios_ativos: 1,
        },
      });

      const usuarioAtualizado = await tx.tB_USUARIO.update({
        where: { id_usuario: usuario.id_usuario },
        data: { id_organizacao: organizacao.id_organizacao },
      });

      if (indicadorId) {
        await tx.tB_INDICACAO.create({
          data: {
            indicador_id: indicadorId,
            indicado_id: usuario.id_usuario,
            status: 'pendente',
            desconto_percentual: 20,
          },
        });

        const totalIndicacoes = await tx.tB_INDICACAO.count({
          where: { indicador_id: indicadorId, status: 'convertido' },
        });

        const descontoPercentual = Math.min(totalIndicacoes * 20, 100);

        await tx.tB_USUARIO.update({
          where: { id_usuario: indicadorId },
          data: {
            total_indicacoes_validas: totalIndicacoes,
            desconto_indicacao_percentual: descontoPercentual,
          },
        });
      }

      return { usuario: usuarioAtualizado, organizacao };
    });

    const payload = { sub: resultado.usuario.id_usuario, email: resultado.usuario.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user: {
        id_usuario: resultado.usuario.id_usuario,
        nome: resultado.usuario.nome,
        email: resultado.usuario.email,
        tipo: resultado.usuario.tipo,
        codigo_indicacao: resultado.usuario.codigo_indicacao,
      },
      organizacao: {
        id_organizacao: resultado.organizacao.id_organizacao,
        nome: resultado.organizacao.nome,
        limite_usuarios: resultado.organizacao.limite_usuarios,
      },
      access_token,
      trial: {
        ativo: true,
        expira_em: resultado.usuario.trial_expira_em,
        dias_restantes: 14,
      },
      mensagem: 'Conta criada com sucesso!',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    const usuario = await this.prisma.tB_USUARIO.findUnique({
      where: { email },
      include: {
        organizacao: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    await this.prisma.tB_USUARIO.update({
      where: { id_usuario: usuario.id_usuario },
      data: { dt_ultimo_acesso: new Date() },
    });

    const payload = { sub: usuario.id_usuario, email: usuario.email };
    const access_token = this.jwtService.sign(payload);

    let dias_restantes = 0;
    if (usuario.trial_ativo && usuario.trial_expira_em) {
      const diff = usuario.trial_expira_em.getTime() - Date.now();
      dias_restantes = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return {
      user: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        email_verificado: usuario.email_verificado,
      },
      organizacao: usuario.organizacao,
      access_token,
      trial: {
        ativo: usuario.trial_ativo,
        expira_em: usuario.trial_expira_em,
        dias_restantes,
      },
    };
  }

  async getMe(userId: string) {
    const usuario = await this.prisma.tB_USUARIO.findUnique({
      where: { id_usuario: userId },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        tipo: true,
        foto_url: true,
        email_verificado: true,
        trial_ativo: true,
        trial_expira_em: true,
        plano_tipo: true,
        codigo_indicacao: true,
        total_indicacoes_validas: true,
        desconto_indicacao_percentual: true,
        armazenamento_usado_mb: true,
        armazenamento_limite_mb: true,
        created_at: true,
        organizacao: {
          select: {
            id_organizacao: true,
            nome: true,
            limite_usuarios: true,
            usuarios_ativos: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return usuario;
  }
}