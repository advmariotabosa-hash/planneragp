import { IsString, IsNotEmpty, IsDateString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CriarAssembleiaDto {
  @IsString()
  @IsNotEmpty()
  nome_organizacao: string;

  @IsString()
  @IsNotEmpty()
  email_contato: string;

  @IsDateString()
  data_assembleia: string;

  @IsInt()
  @Min(1)
  @Max(100)
  max_participantes: number;

  @IsString()
  @IsOptional()
  pauta_assembleia?: string;
}
