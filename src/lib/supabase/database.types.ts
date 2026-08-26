export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          uid: string;
          email: string;
          nome: string;
          role: 'vendedor' | 'admin';
          ativo: boolean;
          avatar: string | null;
          cargo: string | null;
          telefone: string | null;
          meta_faturamento: number;
          meta_volume: number;
          meta_ticket_medio: number | null;
          meta_conversao: number | null;
          criado_por: string | null;
          data_criacao: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          uid: string;
          email: string;
          nome: string;
          role?: 'vendedor' | 'admin';
          ativo?: boolean;
          avatar?: string | null;
          cargo?: string | null;
          telefone?: string | null;
          meta_faturamento?: number;
          meta_volume?: number;
          meta_ticket_medio?: number | null;
          meta_conversao?: number | null;
          criado_por?: string | null;
          data_criacao?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          uid?: string;
          email?: string;
          nome?: string;
          role?: 'vendedor' | 'admin';
          ativo?: boolean;
          avatar?: string | null;
          cargo?: string | null;
          telefone?: string | null;
          meta_faturamento?: number;
          meta_volume?: number;
          meta_ticket_medio?: number | null;
          meta_conversao?: number | null;
          criado_por?: string | null;
          data_criacao?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cotacoes: {
        Row: {
          id: string;
          vendedor_id: string;
          vendedor_nome: string;
          cliente: string;
          cliente_cnpj: string | null;
          cliente_email: string | null;
          cliente_telefone: string | null;
          valor_total: number;
          seguradora: string;
          produtos: string[];
          status: 'nova' | 'em_analise' | 'enviada' | 'aguardando' | 'revisao' | 'fechada' | 'perdida';
          origem: string | null;
          ramo: string | null;
          motivo_perda: string | null;
          pdf_url: string | null;
          pdf_name: string | null;
          observacoes: string | null;
          historico_status: Json;
          data_criacao: string;
          data_fechamento: string | null;
          data_ultima_atualizacao: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendedor_id: string;
          vendedor_nome: string;
          cliente: string;
          cliente_cnpj?: string | null;
          cliente_email?: string | null;
          cliente_telefone?: string | null;
          valor_total?: number;
          seguradora: string;
          produtos?: string[];
          status?: 'nova' | 'em_analise' | 'enviada' | 'aguardando' | 'revisao' | 'fechada' | 'perdida';
          origem?: string | null;
          ramo?: string | null;
          motivo_perda?: string | null;
          pdf_url?: string | null;
          pdf_name?: string | null;
          observacoes?: string | null;
          historico_status?: Json;
          data_criacao?: string;
          data_fechamento?: string | null;
          data_ultima_atualizacao?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendedor_id?: string;
          vendedor_nome?: string;
          cliente?: string;
          cliente_cnpj?: string | null;
          cliente_email?: string | null;
          cliente_telefone?: string | null;
          valor_total?: number;
          seguradora?: string;
          produtos?: string[];
          status?: 'nova' | 'em_analise' | 'enviada' | 'aguardando' | 'revisao' | 'fechada' | 'perdida';
          origem?: string | null;
          ramo?: string | null;
          motivo_perda?: string | null;
          pdf_url?: string | null;
          pdf_name?: string | null;
          observacoes?: string | null;
          historico_status?: Json;
          data_criacao?: string;
          data_fechamento?: string | null;
          data_ultima_atualizacao?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'vendedor' | 'admin';
      quote_status: 'nova' | 'em_analise' | 'enviada' | 'aguardando' | 'revisao' | 'fechada' | 'perdida';
    };
  };
}
