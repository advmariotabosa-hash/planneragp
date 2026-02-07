import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CriarPendenciaDto {
  @IsString()
  @IsNotEmpty()
  id_pauta: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  responsavel_id: string;

  @IsDateString()
  prazo: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
```

### **4. Commit:**
```
feat: adiciona DTO para criar pendência
