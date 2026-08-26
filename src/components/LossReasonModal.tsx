import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { Cotacao } from '../types';
import { formatCurrencyBRL } from '../lib/formatters';

interface LossReasonModalProps {
  cotacao: Cotacao | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmLoss: (cotacaoId: string, reason: string) => void;
}

const COMMON_LOSS_REASONS = [
  'Preço alto / Fechou com concorrente por menor valor',
  'Fechou com o banco de relacionamento',
  'Cliente desistiu da contratação do seguro',
  'Recusado pela seguradora na análise de risco / vistoria',
  'Cliente optou por manter a apólice atual',
  'Sem retorno do cliente após múltiplas tentativas',
  'Outro motivo específico'
];

export const LossReasonModal: React.FC<LossReasonModalProps> = ({
  cotacao,
  isOpen,
  onClose,
  onConfirmLoss,
}) => {
  const [selectedReason, setSelectedReason] = useState(COMMON_LOSS_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !cotacao) return null;

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Outro motivo específico' && customReason.trim()
      ? customReason.trim()
      : selectedReason;

    onConfirmLoss(cotacao.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm text-rose-950">
              Registrar Motivo de Perda
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
            <p className="font-bold text-slate-900">{cotacao.cliente}</p>
            <p className="text-slate-500">{cotacao.seguradora} • {formatCurrencyBRL(cotacao.valorTotal)}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Selecione o motivo principal da perda:
            </label>
            <div className="space-y-1.5">
              {COMMON_LOSS_REASONS.map((reason, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'border-rose-300 bg-rose-50/60 font-semibold text-rose-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="lossReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Outro motivo específico' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descreva o motivo:
              </label>
              <textarea
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Detalhes adicionais sobre a perda..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Confirmar Perda da Cotação
          </button>
        </div>

      </div>
    </div>
  );
};
