import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

enum TipoReuniao {
  ORDINARIA = 'ORDINARIA',
  EXTRAORDINARIA = 'EXTRAORDINARIA',
  INAUGURAL = 'INAUGURAL',
  OUTRO = 'OUTRO'
}

enum StatusReuniao {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export class AtualizarReuniaoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(TipoReuniao)
  @IsOptional()
  tipo?: TipoReuniao;

  @IsDateString()
  @IsOptional()
  dt_inicio?: string;

  @IsDateString()
  @IsOptional()
  dt_fim?: string;

  @IsString()
  @IsOptional()
  localizacao?: string;

  @IsString()
  @IsOptional()
  link_videochamada?: string;

  @IsEnum(StatusReuniao)
  @IsOptional()
  status?: StatusReuniao;
}
