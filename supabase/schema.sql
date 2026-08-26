-- ============================================================================
-- SEGURFLOW - SUPABASE DATABASE SCHEMA & POLICIES
-- Execute este script no "SQL Editor" do seu painel Supabase
-- ============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Usuários / Corretores
CREATE TABLE IF NOT EXISTS public.usuarios (
    uid TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'vendedor' CHECK (role IN ('vendedor', 'admin')),
    ativo BOOLEAN NOT NULL DEFAULT true,
    avatar TEXT,
    cargo TEXT,
    telefone TEXT,
    meta_faturamento NUMERIC(14, 2) NOT NULL DEFAULT 100000.00,
    meta_volume INTEGER NOT NULL DEFAULT 20,
    meta_ticket_medio NUMERIC(14, 2),
    meta_conversao NUMERIC(5, 2),
    criado_por TEXT,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabela de Cotações / Propostas
CREATE TABLE IF NOT EXISTS public.cotacoes (
    id TEXT PRIMARY KEY,
    vendedor_id TEXT NOT NULL,
    vendedor_nome TEXT NOT NULL,
    cliente TEXT NOT NULL,
    cliente_cnpj TEXT,
    cliente_email TEXT,
    cliente_telefone TEXT,
    valor_total NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    seguradora TEXT NOT NULL,
    produtos TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'nova' CHECK (status IN ('nova', 'em_analise', 'enviada', 'aguardando', 'revisao', 'fechada', 'perdida')),
    origem TEXT DEFAULT 'Upload Manual',
    ramo TEXT,
    motivo_perda TEXT,
    pdf_url TEXT,
    pdf_name TEXT,
    observacoes TEXT,
    historico_status JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_fechamento TIMESTAMPTZ,
    data_ultima_atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Índices para performance e consultas
CREATE INDEX IF NOT EXISTS idx_cotacoes_vendedor_id ON public.cotacoes(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_cotacoes_status ON public.cotacoes(status);
CREATE INDEX IF NOT EXISTS idx_cotacoes_data_criacao ON public.cotacoes(data_criacao DESC);
CREATE INDEX IF NOT EXISTS idx_cotacoes_seguradora ON public.cotacoes(seguradora);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON public.usuarios(role);

-- 5. Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_usuarios_updated_at ON public.usuarios;
CREATE TRIGGER trigger_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_cotacoes_updated_at ON public.cotacoes;
CREATE TRIGGER trigger_cotacoes_updated_at
    BEFORE UPDATE ON public.cotacoes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Row Level Security (RLS)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para Usuários
CREATE POLICY "Permitir leitura pública/autenticada de usuários"
    ON public.usuarios FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção e atualização de usuários"
    ON public.usuarios FOR ALL
    USING (true)
    WITH CHECK (true);

-- Políticas de acesso para Cotações
CREATE POLICY "Permitir leitura de cotações"
    ON public.cotacoes FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção e modificação de cotações"
    ON public.cotacoes FOR ALL
    USING (true)
    WITH CHECK (true);

-- 7. Configuração do Storage para PDFs de Propostas
INSERT INTO storage.buckets (id, name, public)
VALUES ('propostas-pdf', 'propostas-pdf', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso para Storage de PDFs
CREATE POLICY "Permitir acesso público de leitura aos PDFs"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'propostas-pdf');

CREATE POLICY "Permitir upload de PDFs"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'propostas-pdf');

CREATE POLICY "Permitir atualização de PDFs"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'propostas-pdf');

-- 8. Dados Iniciais de Demonstração (Opcional)
INSERT INTO public.usuarios (uid, email, nome, role, ativo, cargo, meta_faturamento, meta_volume)
VALUES 
    ('user_vendedor_1', 'carlos.mendes@corretora.com.br', 'Carlos Mendes', 'vendedor', true, 'Consultor Comercial Sênior', 150000.00, 25),
    ('user_vendedor_2', 'mariana.silva@corretora.com.br', 'Mariana Silva', 'vendedor', true, 'Consultora Corporate', 120000.00, 18),
    ('user_admin_1', 'diretoria@corretora.com.br', 'Ana Paula Castro', 'admin', true, 'Diretora Comercial', 300000.00, 50)
ON CONFLICT (uid) DO NOTHING;
