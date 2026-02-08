import { IsString, IsNotEmpty, IsArray, IsOptional, ArrayMinSize } from 'class-validator';

export class CriarVotacaoDto {
  @IsString()
  @IsNotEmpty()
  assembleia_id: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  opcoes: string[];
}
