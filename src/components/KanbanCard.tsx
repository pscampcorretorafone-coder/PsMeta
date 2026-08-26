import React from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertCircle,
  Tag,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { Cotacao, QuoteStatus } from '../types';
import { formatCurrencyBRL, formatRelativeTimeBR, getDaysSince } from '../lib/formatters';

interface KanbanCardProps {
  cotacao: Cotacao;
  onSelect: (cotacao: Cotacao) => void;
  onMoveStatus: (cotacaoId: string, nextStatus: QuoteStatus) => void;
  onRequestLoss: (cotacao: Cotacao) => void;
  onQuickWin: (cotacao: Cotacao) => void;
  allColumns: { id: QuoteStatus; title: string }[];
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  cotacao,
  onSelect,
  onMoveStatus,
  onRequestLoss,
  onQuickWin,
  allColumns,
  isDraggable = true,
  onDragStart,
}) => {
  const daysIdle = getDaysSince(cotacao.dataUltimaAtualizacao);
  const isStalled = daysIdle >= 3 && cotacao.status !== 'fechada' && cotacao.status !== 'perdida';

  // Get carrier brand styling
  const getCarrierBadge = (seguradora: string) => {
    const s = seguradora.toLowerCase();
    if (s.includes('porto')) return 'bg-blue-600 text-white';
    if (s.includes('bradesco')) return 'bg-red-600 text-white';
    if (s.includes('sul')) return 'bg-sky-700 text-white';
    if (s.includes('allianz')) return 'bg-blue-800 text-white';
    if (s.includes('tokio')) return 'bg-teal-700 text-white';
    if (s.includes('mapfre')) return 'bg-red-700 text-white';
    if (s.includes('hdi')) return 'bg-emerald-700 text-white';
    return 'bg-slate-700 text-white';
  };

  const currentIndex = allColumns.findIndex(c => c.id === cotacao.status);
  const prevColumn = currentIndex > 0 ? allColumns[currentIndex - 1] : null;
  const nextColumn = currentIndex < allColumns.length - 1 && currentIndex < 5 ? allColumns[currentIndex + 1] : null;

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onDragStart && onDragStart(e, cotacao.id)}
      onClick={() => onSelect(cotacao)}
      className={`group relative bg-white rounded-xl p-4 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-orange-300 ${
        isStalled ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
      } ${cotacao.status === 'fechada' ? 'border-emerald-200 bg-emerald-50/20' : ''} ${
        cotacao.status === 'perdida' ? 'border-slate-200 bg-slate-50/50 opacity-80' : ''
      }`}
    >
      {/* Header with Carrier Badge & Idle Alert */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCarrierBadge(cotacao.seguradora)}`}>
          {cotacao.seguradora}
        </span>

        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          {isStalled && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              {daysIdle}d parado
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatRelativeTimeBR(cotacao.dataUltimaAtualizacao)}
          </span>
        </div>
      </div>

      {/* Client Name */}
      <div className="mb-2">
        <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
          {cotacao.cliente}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
          {cotacao.ramo && (
            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
              {cotacao.ramo}
            </span>
          )}
          {cotacao.origem && (
            <span className="text-slate-500 truncate">
              • {cotacao.origem}
            </span>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 mb-2.5">
        <span className="text-[11px] text-slate-400 font-medium">Prêmio Total:</span>
        <span className="text-sm font-extrabold text-slate-900 tracking-tight">
          {formatCurrencyBRL(cotacao.valorTotal)}
        </span>
      </div>

      {/* Products list tags */}
      {cotacao.produtos && cotacao.produtos.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {cotacao.produtos.slice(0, 2).map((prod, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-100 font-medium px-2 py-0.5 rounded-md truncate max-w-[190px]"
            >
              {prod}
            </span>
          ))}
          {cotacao.produtos.length > 2 && (
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-md">
              +{cotacao.produtos.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Loss reason badge if lost */}
      {cotacao.status === 'perdida' && cotacao.motivoPerda && (
        <div className="mb-2 p-1.5 rounded-md bg-rose-50 border border-rose-100 text-[11px] text-rose-700">
          <span className="font-semibold">Motivo:</span> {cotacao.motivoPerda}
        </div>
      )}

      {/* Quick Move / Status Action Bar */}
      <div 
        className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="font-mono text-[10px] text-slate-400">{cotacao.id}</span>
        </div>

        <div className="flex items-center gap-1">
          {prevColumn && (
            <button
              onClick={() => onMoveStatus(cotacao.id, prevColumn.id)}
              title={`Voltar para ${prevColumn.title}`}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {cotacao.status !== 'fechada' && cotacao.status !== 'perdida' && (
            <>
              <button
                onClick={() => onQuickWin(cotacao)}
                title="Fechar negócio (Ganho) 🎉"
                className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-0.5 transition-colors"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Ganho
              </button>

              <button
                onClick={() => onRequestLoss(cotacao)}
                title="Registrar perda"
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {nextColumn && cotacao.status !== 'fechada' && cotacao.status !== 'perdida' && (
            <button
              onClick={() => onMoveStatus(cotacao.id, nextColumn.id)}
              title={`Avançar para ${nextColumn.title}`}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-[10px] font-bold transition-colors"
            >
              <span>Avançar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
