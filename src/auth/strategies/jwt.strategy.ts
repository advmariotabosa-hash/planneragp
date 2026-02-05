import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'planneragp-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    const usuario = await this.prisma.tB_USUARIO.findUnique({
      where: { id_usuario: payload.sub },
      include: {
        organizacao: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      nome: usuario.nome,
      tipo: usuario.tipo,
      id_organizacao: usuario.id_organizacao,
      organizacao: usuario.organizacao,
    };
  }
}