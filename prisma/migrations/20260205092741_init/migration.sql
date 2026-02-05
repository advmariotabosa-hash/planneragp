-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('master', 'junior');

-- CreateEnum
CREATE TYPE "StatusPendencia" AS ENUM ('pendente', 'concluida');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('pendente', 'aprovado', 'rejeitado');

-- CreateEnum
CREATE TYPE "TipoRecorrencia" AS ENUM ('nenhuma', 'diaria', 'semanal', 'mensal', 'anual');

-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('trial', 'starter_trimestral', 'starter_semestral', 'starter_anual', 'growth_trimestral', 'growth_semestral', 'growth_anual', 'business_trimestral', 'business_semestral', 'business_anual', 'enterprise_trimestral', 'enterprise_semestral', 'enterprise_anual', 'assembleia_1', 'assembleia_2', 'assembleia_4', 'administradora_bronze', 'administradora_prata', 'administradora_ouro', 'administradora_diamante', 'starter', 'growth', 'business', 'enterprise', 'avulso');

-- CreateEnum
CREATE TYPE "PeriodoContratacao" AS ENUM ('trimestral', 'semestral', 'anual');

-- CreateEnum
CREATE TYPE "StatusAssembleia" AS ENUM ('ativa', 'concluida', 'expirada');

-- CreateEnum
CREATE TYPE "TipoConsentimento" AS ENUM ('termos_uso', 'politica_privacidade', 'marketing');

-- CreateEnum
CREATE TYPE "StatusIndicacao" AS ENUM ('pendente', 'convertido', 'recompensado');

-- CreateEnum
CREATE TYPE "StatusConvite" AS ENUM ('pendente', 'aceito', 'expirado', 'cancelado');

-- CreateEnum
CREATE TYPE "TipoRecompensa" AS ENUM ('mes_gratis', 'desconto', 'percentual');

-- CreateEnum
CREATE TYPE "PlanoAdministradora" AS ENUM ('bronze', 'prata', 'ouro', 'diamante');

-- CreateTable
CREATE TABLE "tb_organizacao" (
    "id_organizacao" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "id_master" TEXT NOT NULL,
    "plano_tipo" "TipoPlano" NOT NULL DEFAULT 'trial',
    "limite_usuarios" INTEGER NOT NULL DEFAULT 5,
    "usuarios_ativos" INTEGER NOT NULL DEFAULT 0,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_organizacao_pkey" PRIMARY KEY ("id_organizacao")
);

-- CreateTable
CREATE TABLE "tb_usuario" (
    "id_usuario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "foto_url" TEXT,
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'master',
    "expo_push_token" TEXT,
    "id_organizacao" TEXT,
    "trial_ativo" BOOLEAN NOT NULL DEFAULT true,
    "trial_expira_em" TIMESTAMP(3),
    "plano_tipo" "TipoPlano" NOT NULL DEFAULT 'trial',
    "plano_expira_em" TIMESTAMP(3),
    "periodo_contratacao" "PeriodoContratacao",
    "data_renovacao" TIMESTAMP(3),
    "valor_pago" DECIMAL(10,2),
    "armazenamento_usado_mb" INTEGER NOT NULL DEFAULT 0,
    "armazenamento_limite_mb" INTEGER NOT NULL DEFAULT 5120,
    "armazenamento_extra_mb" INTEGER NOT NULL DEFAULT 0,
    "notificacao_80_enviada" BOOLEAN NOT NULL DEFAULT false,
    "notificacao_95_enviada" BOOLEAN NOT NULL DEFAULT false,
    "codigo_indicacao" TEXT,
    "indicado_por" TEXT,
    "desconto_indicacao_percentual" INTEGER NOT NULL DEFAULT 0,
    "total_indicacoes_validas" INTEGER NOT NULL DEFAULT 0,
    "google_calendar_token" TEXT,
    "google_calendar_refresh" TEXT,
    "google_calendar_token_expiry" TIMESTAMP(3),
    "google_calendar_connected" BOOLEAN NOT NULL DEFAULT false,
    "zoom_access_token" TEXT,
    "zoom_refresh_token" TEXT,
    "zoom_token_expiry" TIMESTAMP(3),
    "zoom_user_id" TEXT,
    "zoom_connected" BOOLEAN NOT NULL DEFAULT false,
    "anonimizado" BOOLEAN NOT NULL DEFAULT false,
    "data_anonimizacao" TIMESTAMP(3),
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "token_verificacao_email" TEXT,
    "data_verificacao_email" TIMESTAMP(3),
    "administradora_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_ultimo_acesso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "tb_convite" (
    "id_convite" TEXT NOT NULL,
    "email_convidado" TEXT NOT NULL,
    "id_master" TEXT NOT NULL,
    "id_organizacao" TEXT NOT NULL,
    "token_ativacao" TEXT NOT NULL,
    "data_convite" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "status" "StatusConvite" NOT NULL DEFAULT 'pendente',
    "id_usuario_criado" TEXT,

    CONSTRAINT "tb_convite_pkey" PRIMARY KEY ("id_convite")
);

-- CreateTable
CREATE TABLE "tb_reuniao" (
    "id_reuniao" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criador_id" TEXT NOT NULL,
    "data_hora_inicio" TIMESTAMP(3),
    "data_hora_fim" TIMESTAMP(3),
    "recorrencia" "TipoRecorrencia" NOT NULL DEFAULT 'nenhuma',
    "recorrencia_pai_id" TEXT,
    "recorrencia_fim" TIMESTAMP(3),
    "google_event_id" TEXT,
    "zoom_meeting_id" TEXT,
    "zoom_join_url" TEXT,
    "zoom_start_url" TEXT,

    CONSTRAINT "tb_reuniao_pkey" PRIMARY KEY ("id_reuniao")
);

-- CreateTable
CREATE TABLE "tb_participante_reuniao" (
    "id" TEXT NOT NULL,
    "id_reuniao" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "tb_participante_reuniao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pauta" (
    "id_pauta" TEXT NOT NULL,
    "id_reuniao" TEXT NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "titulo" VARCHAR(100) NOT NULL,
    "conteudo" TEXT NOT NULL,
    "anexos" TEXT[],
    "autor_nome" TEXT NOT NULL,
    "autor_id" TEXT NOT NULL,

    CONSTRAINT "tb_pauta_pkey" PRIMARY KEY ("id_pauta")
);

-- CreateTable
CREATE TABLE "tb_comentario" (
    "id_comentario" TEXT NOT NULL,
    "id_pauta" TEXT NOT NULL,
    "autor_id" TEXT NOT NULL,
    "conteudo" VARCHAR(200) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_comentario_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "tb_pendencia" (
    "id_pendencia" TEXT NOT NULL,
    "id_pauta" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "responsavel_id" TEXT NOT NULL,
    "prazo" TIMESTAMP(3) NOT NULL,
    "status" "StatusPendencia" NOT NULL DEFAULT 'pendente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recorrencia" "TipoRecorrencia" NOT NULL DEFAULT 'nenhuma',
    "recorrencia_pai_id" TEXT,
    "recorrencia_fim" TIMESTAMP(3),
    "google_event_id" TEXT,

    CONSTRAINT "tb_pendencia_pkey" PRIMARY KEY ("id_pendencia")
);

-- CreateTable
CREATE TABLE "tb_assembleia_avulsa" (
    "id" TEXT NOT NULL,
    "nome_organizacao" TEXT NOT NULL,
    "email_contato" TEXT NOT NULL,
    "data_assembleia" TIMESTAMP(3) NOT NULL,
    "num_participantes" INTEGER NOT NULL DEFAULT 0,
    "max_participantes" INTEGER NOT NULL DEFAULT 30,
    "valor_pago" DECIMAL(10,2) NOT NULL,
    "status" "StatusAssembleia" NOT NULL DEFAULT 'ativa',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "pauta_assembleia" TEXT,
    "ata_assembleia" TEXT,
    "pagamento_id" TEXT,
    "pagamento_status" TEXT,
    "criador_id" TEXT NOT NULL,
    "pacote_id" TEXT,
    "zoom_meeting_id" TEXT,
    "zoom_join_url" TEXT,

    CONSTRAINT "tb_assembleia_avulsa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pacote_assembleia" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo_pacote" TEXT NOT NULL,
    "valor_pago" DECIMAL(10,2) NOT NULL,
    "assembleias_total" INTEGER NOT NULL,
    "assembleias_usadas" INTEGER NOT NULL DEFAULT 0,
    "assembleias_restantes" INTEGER NOT NULL,
    "data_compra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "pagamento_id" TEXT,
    "pagamento_status" TEXT,

    CONSTRAINT "tb_pacote_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_participante_assembleia" (
    "id" TEXT NOT NULL,
    "assembleia_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_participante_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pauta_assembleia" (
    "id" TEXT NOT NULL,
    "assembleia_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_pauta_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_comentario_assembleia" (
    "id" TEXT NOT NULL,
    "pauta_id" TEXT NOT NULL,
    "autor_nome" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_comentario_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_votacao_assembleia" (
    "id" TEXT NOT NULL,
    "assembleia_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "opcoes" TEXT[],
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encerrada_em" TIMESTAMP(3),

    CONSTRAINT "tb_votacao_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_voto_assembleia" (
    "id" TEXT NOT NULL,
    "votacao_id" TEXT NOT NULL,
    "participante_id" TEXT NOT NULL,
    "opcao_escolhida" TEXT NOT NULL,
    "data_voto" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_voto_assembleia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_administradora" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email_contato" TEXT NOT NULL,
    "telefone" TEXT,
    "plano" "PlanoAdministradora" NOT NULL,
    "max_condominios" INTEGER NOT NULL,
    "valor_mensal" DECIMAL(10,2) NOT NULL,
    "assembleias_incluidas" INTEGER NOT NULL,
    "assembleias_usadas" INTEGER NOT NULL DEFAULT 0,
    "data_contratacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_renovacao" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "pagamento_id" TEXT,
    "pagamento_status" TEXT,

    CONSTRAINT "tb_administradora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_condominio_administradora" (
    "id" TEXT NOT NULL,
    "administradora_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT,
    "num_unidades" INTEGER,
    "email_sindico" TEXT,
    "telefone_sindico" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tb_condominio_administradora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_agendamento_externo" (
    "id_agendamento" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nome_solicitante" TEXT NOT NULL,
    "email_solicitante" TEXT NOT NULL,
    "data_hora_desejada" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'pendente',
    "link_unico" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recorrencia" "TipoRecorrencia" NOT NULL DEFAULT 'nenhuma',
    "recorrencia_pai_id" TEXT,
    "recorrencia_fim" TIMESTAMP(3),
    "google_event_id" TEXT,

    CONSTRAINT "tb_agendamento_externo_pkey" PRIMARY KEY ("id_agendamento")
);

-- CreateTable
CREATE TABLE "tb_zoom_reuniao" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "meeting_id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "start_time" TIMESTAMP(3),
    "duration" INTEGER,
    "join_url" TEXT NOT NULL,
    "start_url" TEXT,
    "password" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reuniao_planex_id" TEXT,
    "assembleia_id" TEXT,

    CONSTRAINT "tb_zoom_reuniao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_compra_armazenamento" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "quantidade_mb" INTEGER NOT NULL,
    "valor_pago" DECIMAL(10,2) NOT NULL,
    "data_compra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pagamento_id" TEXT,
    "pagamento_status" TEXT,

    CONSTRAINT "tb_compra_armazenamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_consentimento" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo_consentimento" "TipoConsentimento" NOT NULL,
    "aceito" BOOLEAN NOT NULL,
    "data_aceite" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_aceite" TEXT,
    "versao_documento" TEXT,

    CONSTRAINT "tb_consentimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_log_acesso_lgpd" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dados_acessados" TEXT NOT NULL,
    "ip_origem" TEXT,
    "user_agent" TEXT,
    "data_acesso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_log_acesso_lgpd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_indicacao" (
    "id" TEXT NOT NULL,
    "indicador_id" TEXT NOT NULL,
    "indicado_id" TEXT NOT NULL,
    "data_indicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusIndicacao" NOT NULL DEFAULT 'pendente',
    "recompensa_tipo" "TipoRecompensa",
    "recompensa_valor" DECIMAL(10,2),
    "data_conversao" TIMESTAMP(3),
    "data_recompensa" TIMESTAMP(3),
    "desconto_percentual" INTEGER NOT NULL DEFAULT 20,
    "aplicado_ao_pagamento" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_indicacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_config_planos" (
    "id" TEXT NOT NULL,
    "nome_plano" TEXT NOT NULL,
    "tipo_plano" "TipoPlano" NOT NULL,
    "max_usuarios" INTEGER NOT NULL,
    "armazenamento_mb" INTEGER NOT NULL,
    "valor_trimestral" DECIMAL(10,2) NOT NULL,
    "valor_semestral" DECIMAL(10,2) NOT NULL,
    "valor_anual" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_config_planos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_organizacao_id_master_key" ON "tb_organizacao"("id_master");

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuario_email_key" ON "tb_usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuario_codigo_indicacao_key" ON "tb_usuario"("codigo_indicacao");

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuario_token_verificacao_email_key" ON "tb_usuario"("token_verificacao_email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_convite_token_ativacao_key" ON "tb_convite"("token_ativacao");

-- CreateIndex
CREATE UNIQUE INDEX "tb_convite_id_usuario_criado_key" ON "tb_convite"("id_usuario_criado");

-- CreateIndex
CREATE UNIQUE INDEX "tb_convite_id_organizacao_email_convidado_key" ON "tb_convite"("id_organizacao", "email_convidado");

-- CreateIndex
CREATE UNIQUE INDEX "tb_participante_reuniao_id_reuniao_id_usuario_key" ON "tb_participante_reuniao"("id_reuniao", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "tb_participante_assembleia_assembleia_id_email_key" ON "tb_participante_assembleia"("assembleia_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_voto_assembleia_votacao_id_participante_id_key" ON "tb_voto_assembleia"("votacao_id", "participante_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_administradora_cnpj_key" ON "tb_administradora"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "tb_agendamento_externo_link_unico_key" ON "tb_agendamento_externo"("link_unico");

-- CreateIndex
CREATE UNIQUE INDEX "tb_zoom_reuniao_meeting_id_key" ON "tb_zoom_reuniao"("meeting_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_consentimento_usuario_id_tipo_consentimento_key" ON "tb_consentimento"("usuario_id", "tipo_consentimento");

-- CreateIndex
CREATE UNIQUE INDEX "tb_indicacao_indicado_id_key" ON "tb_indicacao"("indicado_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_indicacao_indicador_id_indicado_id_key" ON "tb_indicacao"("indicador_id", "indicado_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_config_planos_nome_plano_key" ON "tb_config_planos"("nome_plano");

-- AddForeignKey
ALTER TABLE "tb_organizacao" ADD CONSTRAINT "tb_organizacao_id_master_fkey" FOREIGN KEY ("id_master") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_usuario" ADD CONSTRAINT "tb_usuario_id_organizacao_fkey" FOREIGN KEY ("id_organizacao") REFERENCES "tb_organizacao"("id_organizacao") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_usuario" ADD CONSTRAINT "tb_usuario_administradora_id_fkey" FOREIGN KEY ("administradora_id") REFERENCES "tb_administradora"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_usuario" ADD CONSTRAINT "tb_usuario_indicado_por_fkey" FOREIGN KEY ("indicado_por") REFERENCES "tb_usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_convite" ADD CONSTRAINT "tb_convite_id_master_fkey" FOREIGN KEY ("id_master") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_convite" ADD CONSTRAINT "tb_convite_id_organizacao_fkey" FOREIGN KEY ("id_organizacao") REFERENCES "tb_organizacao"("id_organizacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_convite" ADD CONSTRAINT "tb_convite_id_usuario_criado_fkey" FOREIGN KEY ("id_usuario_criado") REFERENCES "tb_usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_reuniao" ADD CONSTRAINT "tb_reuniao_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_reuniao" ADD CONSTRAINT "tb_reuniao_recorrencia_pai_id_fkey" FOREIGN KEY ("recorrencia_pai_id") REFERENCES "tb_reuniao"("id_reuniao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_participante_reuniao" ADD CONSTRAINT "tb_participante_reuniao_id_reuniao_fkey" FOREIGN KEY ("id_reuniao") REFERENCES "tb_reuniao"("id_reuniao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_participante_reuniao" ADD CONSTRAINT "tb_participante_reuniao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "tb_usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pauta" ADD CONSTRAINT "tb_pauta_id_reuniao_fkey" FOREIGN KEY ("id_reuniao") REFERENCES "tb_reuniao"("id_reuniao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pauta" ADD CONSTRAINT "tb_pauta_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_comentario" ADD CONSTRAINT "tb_comentario_id_pauta_fkey" FOREIGN KEY ("id_pauta") REFERENCES "tb_pauta"("id_pauta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_comentario" ADD CONSTRAINT "tb_comentario_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pendencia" ADD CONSTRAINT "tb_pendencia_id_pauta_fkey" FOREIGN KEY ("id_pauta") REFERENCES "tb_pauta"("id_pauta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pendencia" ADD CONSTRAINT "tb_pendencia_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pendencia" ADD CONSTRAINT "tb_pendencia_recorrencia_pai_id_fkey" FOREIGN KEY ("recorrencia_pai_id") REFERENCES "tb_pendencia"("id_pendencia") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_assembleia_avulsa" ADD CONSTRAINT "tb_assembleia_avulsa_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_assembleia_avulsa" ADD CONSTRAINT "tb_assembleia_avulsa_pacote_id_fkey" FOREIGN KEY ("pacote_id") REFERENCES "tb_pacote_assembleia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pacote_assembleia" ADD CONSTRAINT "tb_pacote_assembleia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_participante_assembleia" ADD CONSTRAINT "tb_participante_assembleia_assembleia_id_fkey" FOREIGN KEY ("assembleia_id") REFERENCES "tb_assembleia_avulsa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_pauta_assembleia" ADD CONSTRAINT "tb_pauta_assembleia_assembleia_id_fkey" FOREIGN KEY ("assembleia_id") REFERENCES "tb_assembleia_avulsa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_comentario_assembleia" ADD CONSTRAINT "tb_comentario_assembleia_pauta_id_fkey" FOREIGN KEY ("pauta_id") REFERENCES "tb_pauta_assembleia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_votacao_assembleia" ADD CONSTRAINT "tb_votacao_assembleia_assembleia_id_fkey" FOREIGN KEY ("assembleia_id") REFERENCES "tb_assembleia_avulsa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_voto_assembleia" ADD CONSTRAINT "tb_voto_assembleia_votacao_id_fkey" FOREIGN KEY ("votacao_id") REFERENCES "tb_votacao_assembleia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_voto_assembleia" ADD CONSTRAINT "tb_voto_assembleia_participante_id_fkey" FOREIGN KEY ("participante_id") REFERENCES "tb_participante_assembleia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_condominio_administradora" ADD CONSTRAINT "tb_condominio_administradora_administradora_id_fkey" FOREIGN KEY ("administradora_id") REFERENCES "tb_administradora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_agendamento_externo" ADD CONSTRAINT "tb_agendamento_externo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_agendamento_externo" ADD CONSTRAINT "tb_agendamento_externo_recorrencia_pai_id_fkey" FOREIGN KEY ("recorrencia_pai_id") REFERENCES "tb_agendamento_externo"("id_agendamento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_zoom_reuniao" ADD CONSTRAINT "tb_zoom_reuniao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_compra_armazenamento" ADD CONSTRAINT "tb_compra_armazenamento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_consentimento" ADD CONSTRAINT "tb_consentimento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_log_acesso_lgpd" ADD CONSTRAINT "tb_log_acesso_lgpd_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_indicacao" ADD CONSTRAINT "tb_indicacao_indicador_id_fkey" FOREIGN KEY ("indicador_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_indicacao" ADD CONSTRAINT "tb_indicacao_indicado_id_fkey" FOREIGN KEY ("indicado_id") REFERENCES "tb_usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
