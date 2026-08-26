import React, { useState } from 'react';
import { 
  Mail, 
  Paperclip, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  Check, 
  Loader2,
  Inbox
} from 'lucide-react';
import { User, Cotacao } from '../types';
import { SAMPLE_PDF_PRESETS } from '../mockData';
import { formatCurrencyBRL } from '../lib/formatters';

interface EmailIntakeModalProps {
  onIngestQuote: (quoteData: Partial<Cotacao>) => void;
  activeUser: User;
}

export const EmailIntakeView: React.FC<EmailIntakeModalProps> = ({
  onIngestQuote,
  activeUser,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [senderEmail, setSenderEmail] = useState('carlos.mendes@corretoraflow.com.br');
  const [emailSubject, setEmailSubject] = useState('Fwd: Cotação Audi Q3 2025 - Porto Seguro');
  const [emailBody, setEmailBody] = useState('Segue em anexo a cotação gerada no portal da Porto Seguro para o cliente Carlos Eduardo Silva. Favor lançar no sistema.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const preset = SAMPLE_PDF_PRESETS[selectedPreset];

  const handleSimulateEmailSend = () => {
    setIsProcessing(true);
    setSuccessMessage(null);

    setTimeout(() => {
      onIngestQuote({
        cliente: preset.mockData.cliente,
        clienteCnpj: preset.mockData.clienteCnpj,
        clienteEmail: preset.mockData.clienteEmail,
        clienteTelefone: preset.mockData.clienteTelefone,
        valorTotal: preset.mockData.valorTotal,
        seguradora: preset.mockData.seguradora,
        produtos: preset.mockData.produtos,
        ramo: preset.ramo,
        origem: 'E-mail Ingestão',
        observacoes: `Extraído automaticamente via e-mail enviado por ${senderEmail}`,
        pdfName: preset.fileName
      });

      setIsProcessing(false);
      setSuccessMessage(`Cotação de ${preset.mockData.cliente} (${formatCurrencyBRL(preset.mockData.valorTotal)}) extraída e cadastrada com sucesso no Kanban!`);
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Pipeline de E-mail Automático
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Caixa de Entrada Inteligente (E-mail Ingestion)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Os vendedores podem simplesmente encaminhar e-mails de cotações para <span className="font-mono text-orange-600 font-bold">cotacoes@segurflow.com.br</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-xl text-xs text-indigo-900 font-semibold">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Processamento Gemini 3.7 Flash</span>
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Inbox className="w-4 h-4 text-orange-600" />
            <span>Simulador de Envio de E-mail de Cotação</span>
          </div>
          <span className="text-xs text-slate-400">Para: cotacoes@segurflow.com.br</span>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Escolha a cotação em anexo para simular:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_PDF_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPreset(idx);
                    setEmailSubject(`Fwd: Cotação ${p.title} - ${p.seguradora}`);
                    setEmailBody(`Segue anexo o PDF com a cotação de ${p.mockData.cliente} no valor de ${formatCurrencyBRL(p.mockData.valorTotal)} da seguradora ${p.seguradora}.`);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedPreset === idx
                      ? 'border-orange-500 bg-orange-50/60 font-bold text-orange-950 ring-1 ring-orange-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-500 font-normal">{p.seguradora} • {formatCurrencyBRL(p.mockData.valorTotal)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                De (E-mail do Vendedor)
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assunto do E-mail
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Corpo da Mensagem
            </label>
            <textarea
              rows={3}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
            />
          </div>

          {/* Attached PDF Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Paperclip className="w-4 h-4 text-slate-400" />
              <span>Anexo: {preset.fileName}</span>
              <span className="text-[10px] text-slate-400 font-normal">(1.4 MB)</span>
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PDF Válido
            </span>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Send CTA */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSimulateEmailSend}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando E-mail & Anexo com IA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Simular Envio do E-mail e Ingestão Automática</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
