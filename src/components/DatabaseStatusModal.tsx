import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase/client';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isConfigured = isSupabaseConfigured();

  if (!isOpen) return null;

  const sqlSchemaSnippet = `-- SEGURFLOW - SUPABASE DATABASE SCHEMA
-- Execute este script no SQL Editor do seu Supabase

CREATE TABLE IF NOT EXISTS public.usuarios (
    uid TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'vendedor',
    ativo BOOLEAN NOT NULL DEFAULT true,
    avatar TEXT,
    cargo TEXT,
    telefone TEXT,
    meta_faturamento NUMERIC(14, 2) NOT NULL DEFAULT 100000.00,
    meta_volume INTEGER NOT NULL DEFAULT 20,
    meta_ticket_medio NUMERIC(14, 2),
    meta_conversao NUMERIC(5, 2),
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
    status TEXT NOT NULL DEFAULT 'nova',
    origem TEXT DEFAULT 'Upload Manual',
    ramo TEXT,
    motivo_perda TEXT,
    pdf_url TEXT,
    pdf_name TEXT,
    observacoes TEXT,
    historico_status JSONB NOT NULL DEFAULT '[]'::jsonb,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_fechamento TIMESTAMPTZ,
    data_ultima_atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Storage para PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('propostas-pdf', 'propostas-pdf', true)
ON CONFLICT (id) DO NOTHING;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Conexão Supabase
                {isConfigured ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Conectado
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Modo Local (Demo)
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                PostgreSQL relacional, Autenticação, RLS e Storage de Propostas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm text-slate-300 max-h-[75vh] overflow-y-auto">
          
          {/* Status Alert Banner */}
          {isConfigured ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">Banco de Dados Supabase Conectado!</p>
                <p className="text-xs text-emerald-200/80 mt-0.5 leading-relaxed">
                  Todas as cotações, alterações de status e movimentações de vendedores estão sendo sincronizadas diretamente com a sua instância do PostgreSQL.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Variáveis de Ambiente Não Preenchidas</p>
                <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                  O sistema está operando no <strong>Modo Local Resiliente (LocalStorage)</strong> com dados de teste interativos. Para conectar seu Supabase real, preencha as variáveis de ambiente no menu de configurações.
                </p>
              </div>
            </div>
          )}

          {/* Quick instructions */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              Como conectar seu Supabase em 3 passos:
            </h3>

            <ol className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                <div>
                  <p className="font-medium text-white">Criar Projeto no Supabase</p>
                  <p className="text-slate-400 mt-0.5">Acesse o painel do Supabase e crie um projeto gratuito.</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                <div>
                  <p className="font-medium text-white">Executar o Script SQL</p>
                  <p className="text-slate-400 mt-0.5">
                    No <strong>SQL Editor</strong> do Supabase, cole o script disponível abaixo (ou o arquivo completo em <code className="text-orange-300 bg-slate-900 px-1 py-0.5 rounded">supabase/schema.sql</code>).
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                <div>
                  <p className="font-medium text-white">Configurar as Chaves de API</p>
                  <p className="text-slate-400 mt-0.5">
                    Adicione <code className="text-orange-300 bg-slate-900 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> e <code className="text-orange-300 bg-slate-900 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> nas variáveis de ambiente.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* SQL Snippet preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">
                Estrutura das Tabelas (SQL)
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
              {sqlSchemaSnippet}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/60">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Acessar Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
