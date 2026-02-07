import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CriarPautaDto {
  @IsString()
  @IsNotEmpty()
  id_reuniao: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  conteudo: string;

  @IsArray()
  @IsOptional()
  anexos?: string[];
}
