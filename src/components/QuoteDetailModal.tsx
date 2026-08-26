import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Tag, 
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Send,
  History,
  Edit3,
  Save,
  FileCheck
} from 'lucide-react';
import { Cotacao, QuoteStatus, User as UserType } from '../types';
import { COLUMNS } from '../mockData';
import { formatCurrencyBRL, formatDateBR, formatRelativeTimeBR, formatCpfCnpj, formatPhoneBR } from '../lib/formatters';

interface QuoteDetailModalProps {
  cotacao: Cotacao | null;
  onClose: () => void;
  onUpdateQuote: (updated: Cotacao) => void;
  onRequestLoss: (cotacao: Cotacao) => void;
  onQuickWin: (cotacao: Cotacao) => void;
  currentUser: UserType;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  cotacao,
  onClose,
  onUpdateQuote,
  onRequestLoss,
  onQuickWin,
  currentUser,
}) => {
  if (!cotacao) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedValor, setEditedValor] = useState(cotacao.valorTotal);
  const [editedCliente, setEditedCliente] = useState(cotacao.cliente);
  const [editedEmail, setEditedEmail] = useState(cotacao.clienteEmail || '');
  const [editedTelefone, setEditedTelefone] = useState(cotacao.clienteTelefone || '');
  const [editedObservacoes, setEditedObservacoes] = useState(cotacao.observacoes || '');
  const [newNote, setNewNote] = useState('');

  const currentStatusCol = COLUMNS.find(c => c.id === cotacao.status);

  const handleStatusChange = (newStatus: QuoteStatus) => {
    if (newStatus === 'perdida') {
      onRequestLoss(cotacao);
      return;
    }
    if (newStatus === 'fechada') {
      onQuickWin(cotacao);
      return;
    }

    const updated: Cotacao = {
      ...cotacao,
      status: newStatus,
      dataUltimaAtualizacao: new Date().toISOString(),
      historicoStatus: [
        ...cotacao.historicoStatus,
        {
          status: newStatus,
          data: new Date().toISOString(),
          usuarioNome: currentUser.nome,
          observacao: `Status alterado para ${newStatus.replace('_', ' ')}`
        }
      ]
    };
    onUpdateQuote(updated);
  };

  const handleSaveEdits = () => {
    const updated: Cotacao = {
      ...cotacao,
      cliente: editedCliente,
      valorTotal: Number(editedValor),
      clienteEmail: editedEmail,
      clienteTelefone: editedTelefone,
      observacoes: editedObservacoes,
      dataUltimaAtualizacao: new Date().toISOString()
    };
    onUpdateQuote(updated);
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updated: Cotacao = {
      ...cotacao,
      dataUltimaAtualizacao: new Date().toISOString(),
      historicoStatus: [
        ...cotacao.historicoStatus,
        {
          status: cotacao.status,
          data: new Date().toISOString(),
          usuarioNome: currentUser.nome,
          observacao: newNote.trim()
        }
      ]
    };
    onUpdateQuote(updated);
    setNewNote('');
  };

  // WhatsApp click handler
  const handleWhatsApp = () => {
    const phoneDigits = cotacao.clienteTelefone?.replace(/\D/g, '') || '';
    const message = encodeURIComponent(`Olá ${cotacao.cliente}, tudo bem? Sou ${currentUser.nome} da corretora SegurFlow referente à sua cotação de seguro ${cotacao.seguradora}.`);
    window.open(`https://wa.me/55${phoneDigits}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {cotacao.id}
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${currentStatusCol?.badgeBg}`}>
                {currentStatusCol?.badgeText}
              </span>
              {cotacao.ramo && (
                <span className="text-xs font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded">
                  {cotacao.ramo}
                </span>
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={editedCliente}
                onChange={(e) => setEditedCliente(e.target.value)}
                className="mt-2 text-lg font-bold text-slate-900 px-2 py-1 bg-white border border-slate-300 rounded-lg w-full"
              />
            ) : (
              <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                {cotacao.cliente}
              </h2>
            )}
            
            <p className="text-xs text-slate-500 mt-0.5">
              Consultor Responsável: <span className="font-semibold text-slate-700">{cotacao.vendedorNome}</span> • Criada em {formatDateBR(cotacao.dataCriacao)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Pipeline Step Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Mudar Estágio no Pipeline
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COLUMNS.map((col) => {
                const isActive = cotacao.status === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => handleStatusChange(col.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm ring-2 ring-orange-500'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {col.badgeText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Quote Overview Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 font-medium">Prêmio Total:</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editedValor}
                  onChange={(e) => setEditedValor(parseFloat(e.target.value) || 0)}
                  className="mt-1 text-lg font-extrabold text-slate-900 px-2 py-1 bg-white border border-slate-300 rounded-lg w-full"
                />
              ) : (
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {formatCurrencyBRL(cotacao.valorTotal)}
                </p>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium">Seguradora:</span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {cotacao.seguradora}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium">Origem do Lead:</span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {cotacao.origem || 'Não especificada'}
              </p>
            </div>
          </div>

          {/* Contact & Document Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Details Box */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-orange-600" />
                Dados do Cliente & Contato
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">CPF / CNPJ:</span>
                  <p className="font-semibold text-slate-800">
                    {formatCpfCnpj(cotacao.clienteCnpj) || 'Não informado'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400">E-mail:</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs mt-1"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 flex items-center justify-between">
                      <span>{cotacao.clienteEmail || 'Não informado'}</span>
                      {cotacao.clienteEmail && (
                        <a 
                          href={`mailto:${cotacao.clienteEmail}`} 
                          className="text-orange-600 hover:underline flex items-center gap-0.5 text-[11px]"
                        >
                          <Mail className="w-3.5 h-3.5" /> Enviar
                        </a>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-slate-400">Telefone / Celular:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTelefone}
                      onChange={(e) => setEditedTelefone(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs mt-1"
                    />
                  ) : (
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-semibold text-slate-800">
                        {formatPhoneBR(cotacao.clienteTelefone) || 'Não informado'}
                      </span>
                      {cotacao.clienteTelefone && (
                        <button
                          onClick={handleWhatsApp}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          WhatsApp
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document / PDF Source Box */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Arquivo PDF da Cotação
              </h4>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {cotacao.pdfName || 'cotacao_seguro.pdf'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Processado via Gemini AI • Status OK
                    </p>
                  </div>
                </div>
              </div>

              {cotacao.status === 'perdida' && cotacao.motivoPerda && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  <span className="font-bold">Motivo do Não Fechamento:</span> {cotacao.motivoPerda}
                </div>
              )}
            </div>

          </div>

          {/* Products & Coverages Contratadas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Produtos e Coberturas Incluídas ({cotacao.produtos?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {cotacao.produtos?.map((prod, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  {prod}
                </span>
              ))}
            </div>
          </div>

          {/* Observações / Síntese */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Observações Comerciais & Condições Especiais
            </h4>
            {isEditing ? (
              <textarea
                rows={3}
                value={editedObservacoes}
                onChange={(e) => setEditedObservacoes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
              />
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {cotacao.observacoes || 'Nenhuma observação cadastrada para esta proposta.'}
              </div>
            )}
          </div>

          {/* Status Timeline History */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              Histórico de Movimentações & Anotações
            </h4>

            {/* Add note bar */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="Registrar anotação ou contato com o cliente..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Salvar Nota</span>
              </button>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-2">
              {cotacao.historicoStatus?.slice().reverse().map((entry, idx) => (
                <div key={idx} className="relative pl-4">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white" />
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-800 capitalize">
                      {entry.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDateBR(entry.data)}
                    </span>
                  </div>
                  {entry.usuarioNome && (
                    <p className="text-[11px] text-slate-500">
                      Por: <span className="font-semibold text-slate-700">{entry.usuarioNome}</span>
                    </p>
                  )}
                  {entry.observacao && (
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {entry.observacao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          {isEditing ? (
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md ml-auto"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {cotacao.status !== 'fechada' && cotacao.status !== 'perdida' && (
                  <>
                    <button
                      onClick={() => onQuickWin(cotacao)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Fechar Cotação (Ganho) 🎉</span>
                    </button>
                    <button
                      onClick={() => onRequestLoss(cotacao)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Marcar Perdida</span>
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Fechar
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
