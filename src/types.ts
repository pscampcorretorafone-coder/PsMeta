export type UserRole = 'vendedor' | 'admin';

export type QuoteStatus = 
  | 'nova'
  | 'em_analise'
  | 'enviada'
  | 'aguardando'
  | 'revisao'
  | 'fechada'
  | 'perdida';

export interface User {
  uid: string;
  email: string;
  nome: string;
  role: UserRole;
  ativo: boolean;
  avatar?: string;
  cargo?: string;
  telefone?: string;
  dataCriacao: string;
  criadoPor?: string;
  metaFaturamento: number;
  metaVolume: number;
  metaTicketMedio?: number;
  metaConversao?: number;
}

export interface StatusHistoryEntry {
  status: QuoteStatus;
  data: string;
  usuarioNome?: string;
  observacao?: string;
}

export interface Cotacao {
  id: string;
  vendedorId: string;
  vendedorNome: string;
  cliente: string;
  clienteCnpj?: string;
  clienteEmail?: string;
  clienteTelefone?: string;
  valorTotal: number;
  seguradora: string;
  produtos: string[];
  status: QuoteStatus;
  origem?: string;
  dataCriacao: string;
  dataFechamento?: string;
  dataUltimaAtualizacao: string;
  historicoStatus: StatusHistoryEntry[];
  motivoPerda?: string;
  pdfUrl?: string;
  pdfName?: string;
  observacoes?: string;
  ramo?: string; // Auto, Saúde PME, Vida, Empresarial, Residencial, etc.
}

export interface ExtractedQuoteData {
  cliente: string;
  clienteCnpj?: string;
  clienteEmail?: string;
  clienteTelefone?: string;
  valorTotal: number;
  seguradora: string;
  produtos: string[];
  dataCotacao?: string;
  ramo?: string;
  origem?: string;
  resumoCoberturas?: string;
  confiancaIa?: number; // 0 to 100
}

export interface ColumnDefinition {
  id: QuoteStatus;
  title: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}
