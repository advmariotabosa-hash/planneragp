import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum TipoReuniao {
  ORDINARIA = 'ORDINARIA',
  EXTRAORDINARIA = 'EXTRAORDINARIA',
  INAUGURAL = 'INAUGURAL',
  OUTRO = 'OUTRO'
}

export enum StatusReuniao {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export class AtualizarReuniaoDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(TipoReuniao)
  @IsOptional()
  tipo?: TipoReuniao;

  @IsDateString()
  @IsOptional()
  data_hora_inicio?: string;

  @IsDateString()
  @IsOptional()
  data_hora_fim?: string;

  @IsString()
  @IsOptional()
  local?: string;

  @IsString()
  @IsOptional()
  link_reuniao?: string;

  @IsEnum(StatusReuniao)
  @IsOptional()
  status?: StatusReuniao;
}
