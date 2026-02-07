import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum StatusPendencia {
  PENDENTE = 'pendente',
  CONCLUIDA = 'concluida'
}

export class AtualizarPendenciaDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  responsavel_id?: string;

  @IsDateString()
  @IsOptional()
  prazo?: string;

  @IsEnum(StatusPendencia)
  @IsOptional()
  status?: StatusPendencia;

  @IsString()
  @IsOptional()
  descricao?: string;
}
