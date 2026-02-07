import { IsString, IsOptional, IsArray } from 'class-validator';

export class AtualizarPautaDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  conteudo?: string;

  @IsArray()
  @IsOptional()
  anexos?: string[];
}
