import { supabase, isSupabaseConfigured } from './client';
import { Cotacao, User, QuoteStatus, StatusHistoryEntry } from '../../types';
import { Database, Json } from './database.types';

type CotacaoRow = Database['public']['Tables']['cotacoes']['Row'];
type CotacaoInsert = Database['public']['Tables']['cotacoes']['Insert'];
type UsuarioRow = Database['public']['Tables']['usuarios']['Row'];
type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert'];

// Convert DB snake_case row to frontend Cotacao interface
export function mapRowToCotacao(row: CotacaoRow): Cotacao {
  return {
    id: row.id,
    vendedorId: row.vendedor_id,
    vendedorNome: row.vendedor_nome,
    cliente: row.cliente,
    clienteCnpj: row.cliente_cnpj || undefined,
    clienteEmail: row.cliente_email || undefined,
    clienteTelefone: row.cliente_telefone || undefined,
    valorTotal: Number(row.valor_total),
    seguradora: row.seguradora,
    produtos: Array.isArray(row.produtos) ? row.produtos : [],
    status: row.status as QuoteStatus,
    origem: row.origem || undefined,
    ramo: row.ramo || undefined,
    motivoPerda: row.motivo_perda || undefined,
    pdfUrl: row.pdf_url || undefined,
    pdfName: row.pdf_name || undefined,
    observacoes: row.observacoes || undefined,
    dataCriacao: row.data_criacao,
    dataFechamento: row.data_fechamento || undefined,
    dataUltimaAtualizacao: row.data_ultima_atualizacao,
    historicoStatus: Array.isArray(row.historico_status)
      ? (row.historico_status as unknown as StatusHistoryEntry[])
      : [],
  };
}

// Convert frontend Cotacao interface to DB insert/update object
export function mapCotacaoToRow(cotacao: Cotacao): CotacaoInsert {
  return {
    id: cotacao.id,
    vendedor_id: cotacao.vendedorId,
    vendedor_nome: cotacao.vendedorNome,
    cliente: cotacao.cliente,
    cliente_cnpj: cotacao.clienteCnpj || null,
    cliente_email: cotacao.clienteEmail || null,
    cliente_telefone: cotacao.clienteTelefone || null,
    valor_total: cotacao.valorTotal,
    seguradora: cotacao.seguradora,
    produtos: cotacao.produtos,
    status: cotacao.status,
    origem: cotacao.origem || null,
    ramo: cotacao.ramo || null,
    motivo_perda: cotacao.motivoPerda || null,
    pdf_url: cotacao.pdfUrl || null,
    pdf_name: cotacao.pdfName || null,
    observacoes: cotacao.observacoes || null,
    data_criacao: cotacao.dataCriacao,
    data_fechamento: cotacao.dataFechamento || null,
    data_ultima_atualizacao: cotacao.dataUltimaAtualizacao,
    historico_status: (cotacao.historicoStatus as unknown as Json) || [],
  };
}

// Convert DB snake_case row to frontend User interface
export function mapRowToUser(row: UsuarioRow): User {
  return {
    uid: row.uid,
    email: row.email,
    nome: row.nome,
    role: row.role,
    ativo: row.ativo,
    avatar: row.avatar || undefined,
    cargo: row.cargo || undefined,
    telefone: row.telefone || undefined,
    criadoPor: row.criado_por || undefined,
    dataCriacao: row.data_criacao,
    metaFaturamento: Number(row.meta_faturamento),
    metaVolume: Number(row.meta_volume),
    metaTicketMedio: row.meta_ticket_medio ? Number(row.meta_ticket_medio) : undefined,
    metaConversao: row.meta_conversao ? Number(row.meta_conversao) : undefined,
  };
}

// Convert frontend User to DB row
export function mapUserToRow(user: User): UsuarioInsert {
  return {
    uid: user.uid,
    email: user.email,
    nome: user.nome,
    role: user.role,
    ativo: user.ativo,
    avatar: user.avatar || null,
    cargo: user.cargo || null,
    telefone: user.telefone || null,
    criado_por: user.criadoPor || null,
    data_criacao: user.dataCriacao,
    meta_faturamento: user.metaFaturamento,
    meta_volume: user.metaVolume,
    meta_ticket_medio: user.metaTicketMedio || null,
    meta_conversao: user.metaConversao || null,
  };
}

/* =========================================================================
   Cotacoes Services
   ========================================================================= */

export async function getCotacoesFromSupabase(vendedorId?: string): Promise<Cotacao[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    let query = supabase.from('cotacoes').select('*').order('data_criacao', { ascending: false });

    if (vendedorId) {
      query = query.eq('vendedor_id', vendedorId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar cotações no Supabase:', error);
      return null;
    }

    return (data || []).map(mapRowToCotacao);
  } catch (err) {
    console.error('Exceção ao buscar cotações no Supabase:', err);
    return null;
  }
}

export async function saveCotacaoToSupabase(cotacao: Cotacao): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const row = mapCotacaoToRow(cotacao);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('cotacoes').upsert(row as any, { onConflict: 'id' });

    if (error) {
      console.error('Erro ao salvar cotação no Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exceção ao salvar cotação no Supabase:', err);
    return false;
  }
}

export async function deleteCotacaoFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from('cotacoes').delete().eq('id', id);

    if (error) {
      console.error('Erro ao excluir cotação no Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exceção ao excluir cotação no Supabase:', err);
    return false;
  }
}

/* =========================================================================
   Users Services
   ========================================================================= */

export async function getUsersFromSupabase(): Promise<User[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase.from('usuarios').select('*').order('nome');

    if (error) {
      console.error('Erro ao buscar usuários no Supabase:', error);
      return null;
    }

    return (data || []).map(mapRowToUser);
  } catch (err) {
    console.error('Exceção ao buscar usuários no Supabase:', err);
    return null;
  }
}

export async function saveUserToSupabase(user: User): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const row = mapUserToRow(user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from('usuarios').upsert(row as any, { onConflict: 'uid' });

    if (error) {
      console.error('Erro ao salvar usuário no Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exceção ao salvar usuário no Supabase:', err);
    return false;
  }
}

/* =========================================================================
   Storage: PDF Upload
   ========================================================================= */

export async function uploadPdfToSupabase(
  file: File | Blob,
  fileName: string
): Promise<{ publicUrl: string; error?: string } | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const bucketName = 'propostas-pdf';
    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `cotacoes/${timestamp}_${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Erro ao fazer upload do PDF para o Supabase Storage:', uploadError);
      return { publicUrl: '', error: uploadError.message };
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return { publicUrl: data.publicUrl };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Falha no upload';
    console.error('Exceção no upload de arquivo:', err);
    return { publicUrl: '', error: errorMsg };
  }
}
