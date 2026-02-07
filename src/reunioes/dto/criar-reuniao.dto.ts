import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum TipoReuniao {
  ORDINARIA = 'ORDINARIA',
  EXTRAORDINARIA = 'EXTRAORDINARIA',
  INAUGURAL = 'INAUGURAL',
  OUTRO = 'OUTRO'
}

export class CriarReuniaoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(TipoReuniao)
  tipo: TipoReuniao;

  @IsDateString()
  data_hora_inicio: string;

  @IsDateString()
  @IsOptional()
  data_hora_fim?: string;

  @IsString()
  @IsOptional()
  local?: string;

  @IsString()
  @IsOptional()
  link_reuniao?: string;

  @IsArray()
  @IsOptional()
  participantes?: string[];
}
