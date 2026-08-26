import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Target, 
  DollarSign, 
  PieChart, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Layers,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { Cotacao, QuoteStatus, User } from '../types';
import { COLUMNS } from '../mockData';
import { KanbanCard } from './KanbanCard';
import { formatCurrencyBRL } from '../lib/formatters';

interface KanbanBoardProps {
  cotacoes: Cotacao[];
  activeUser: User;
  allUsers: User[];
  onSelectCotacao: (cotacao: Cotacao) => void;
  onMoveStatus: (cotacaoId: string, nextStatus: QuoteStatus) => void;
  onRequestLoss: (cotacao: Cotacao) => void;
  onQuickWin: (cotacao: Cotacao) => void;
  onOpenUpload: () => void;
  selectedVendorFilter?: string;
  onSelectVendorFilter?: (vendedorId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  cotacoes,
  activeUser,
  allUsers,
  onSelectCotacao,
  onMoveStatus,
  onRequestLoss,
  onQuickWin,
  onOpenUpload,
  selectedVendorFilter,
  onSelectVendorFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeguradora, setSelectedSeguradora] = useState<string>('todas');
  const [selectedRamo, setSelectedRamo] = useState<string>('todos');
  const [draggedOverColumn, setDraggedOverColumn] = useState<QuoteStatus | null>(null);

  // Filter cotacoes according to user permissions:
  // If activeUser is admin, they can see all or filter by vendor.
  // If activeUser is vendedor, they see only their quotes.
  const userFilteredCotacoes = useMemo(() => {
    if (activeUser.role === 'admin') {
      if (selectedVendorFilter && selectedVendorFilter !== 'todos') {
        return cotacoes.filter(c => c.vendedorId === selectedVendorFilter);
      }
      return cotacoes;
    }
    return cotacoes.filter(c => c.vendedorId === activeUser.uid);
  }, [cotacoes, activeUser, selectedVendorFilter]);

  // Apply search and dropdown filters
  const filteredCotacoes = useMemo(() => {
    return userFilteredCotacoes.filter(c => {
      const matchesSearch = 
        searchTerm === '' ||
        c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.seguradora.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.produtos.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.clienteCnpj && c.clienteCnpj.includes(searchTerm)) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeguradora = 
        selectedSeguradora === 'todas' || 
        c.seguradora.toLowerCase().includes(selectedSeguradora.toLowerCase());

      const matchesRamo = 
        selectedRamo === 'todos' || 
        (c.ramo && c.ramo.toLowerCase() === selectedRamo.toLowerCase());

      return matchesSearch && matchesSeguradora && matchesRamo;
    });
  }, [userFilteredCotacoes, searchTerm, selectedSeguradora, selectedRamo]);

  // Calculate top goals and progress metrics for the selected view
  const metrics = useMemo(() => {
    const fechadas = userFilteredCotacoes.filter(c => c.status === 'fechada');
    const faturamentoFechado = fechadas.reduce((acc, c) => acc + c.valorTotal, 0);
    const volumeFechado = fechadas.length;

    const totalPipeline = userFilteredCotacoes.reduce((acc, c) => acc + c.valorTotal, 0);
    const totalCount = userFilteredCotacoes.length;

    // Target values based on user or sum of team
    let metaFaturamento = activeUser.metaFaturamento || 100000;
    let metaVolume = activeUser.metaVolume || 20;

    if (activeUser.role === 'admin' && (!selectedVendorFilter || selectedVendorFilter === 'todos')) {
      metaFaturamento = allUsers
        .filter(u => u.role === 'vendedor')
        .reduce((sum, u) => sum + (u.metaFaturamento || 100000), 0);
      metaVolume = allUsers
        .filter(u => u.role === 'vendedor')
        .reduce((sum, u) => sum + (u.metaVolume || 20), 0);
    } else if (activeUser.role === 'admin' && selectedVendorFilter) {
      const currentVendedor = allUsers.find(u => u.uid === selectedVendorFilter);
      if (currentVendedor) {
        metaFaturamento = currentVendedor.metaFaturamento || 100000;
        metaVolume = currentVendedor.metaVolume || 20;
      }
    }

    const percentFaturamento = metaFaturamento > 0 ? Math.min(Math.round((faturamentoFechado / metaFaturamento) * 100), 100) : 0;
    const percentVolume = metaVolume > 0 ? Math.min(Math.round((volumeFechado / metaVolume) * 100), 100) : 0;
    const ticketMedio = volumeFechado > 0 ? faturamentoFechado / volumeFechado : 0;
    const taxaConversao = totalCount > 0 ? Math.round((volumeFechado / totalCount) * 100) : 0;

    return {
      faturamentoFechado,
      metaFaturamento,
      percentFaturamento,
      volumeFechado,
      metaVolume,
      percentVolume,
      totalPipeline,
      ticketMedio,
      taxaConversao,
      totalCount
    };
  }, [userFilteredCotacoes, activeUser, selectedVendorFilter, allUsers]);

  // Distinct carriers and branches for filter dropdowns
  const availableSeguradoras = useMemo(() => {
    const list = Array.from(new Set(cotacoes.map(c => c.seguradora))).filter(Boolean);
    return list;
  }, [cotacoes]);

  const availableRamos = useMemo(() => {
    const list = Array.from(new Set(cotacoes.map(c => c.ramo))).filter(Boolean) as string[];
    return list;
  }, [cotacoes]);

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, cotacaoId: string) => {
    e.dataTransfer.setData('text/plain', cotacaoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: QuoteStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverColumn !== colId) {
      setDraggedOverColumn(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: QuoteStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const cotacaoId = e.dataTransfer.getData('text/plain');
    if (cotacaoId) {
      const cot = cotacoes.find(c => c.id === cotacaoId);
      if (cot && cot.status !== targetStatus) {
        if (targetStatus === 'perdida') {
          onRequestLoss(cot);
        } else if (targetStatus === 'fechada') {
          onQuickWin(cot);
        } else {
          onMoveStatus(cotacaoId, targetStatus);
        }
      }
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Top Goals & Sales Progress Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                Metas do Mês • Agosto 2026
              </span>
              {activeUser.role === 'admin' && (
                <span className="text-xs text-slate-500 font-medium">
                  {selectedVendorFilter && selectedVendorFilter !== 'todos' 
                    ? `Visualizando: ${allUsers.find(u => u.uid === selectedVendorFilter)?.nome}` 
                    : 'Visão Consolidada da Corretora'}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Desempenho Comercial & Pipeline
            </h2>
          </div>

          {/* Admin Vendor Filter if in Admin Role */}
          {activeUser.role === 'admin' && onSelectVendorFilter && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filtrar Vendedor:</span>
              <select
                value={selectedVendorFilter || 'todos'}
                onChange={(e) => onSelectVendorFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="todos">Todos os Vendedores (Geral)</option>
                {allUsers
                  .filter(u => u.role === 'vendedor')
                  .map(v => (
                    <option key={v.uid} value={v.uid}>
                      {v.nome}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* 4 Progress Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          
          {/* Revenue Goal Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Faturamento Fechado
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                {metrics.percentFaturamento}%
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrencyBRL(metrics.faturamentoFechado)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {formatCurrencyBRL(metrics.metaFaturamento)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.percentFaturamento}%` }}
              />
            </div>
          </div>

          {/* Volume Goal Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                Volume de Apólices
              </span>
              <span className="font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                {metrics.percentVolume}%
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                {metrics.volumeFechado}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                de {metrics.metaVolume} cotações fechadas
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.percentVolume}%` }}
              />
            </div>
          </div>

          {/* Ticket Médio */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                Ticket Médio
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Ganhos
              </span>
            </div>
            <p className="text-lg font-extrabold text-slate-900">
              {formatCurrencyBRL(metrics.ticketMedio)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Média por proposta convertida
            </p>
          </div>

          {/* Taxa de Conversão & Pipeline Total */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-purple-600" />
                Taxa de Conversão
              </span>
              <span className="font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded">
                {metrics.taxaConversao}%
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrencyBRL(metrics.totalPipeline)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Em pipeline ({metrics.totalCount} cotações ativas)
            </p>
          </div>

        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, seguradora, produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Seguradora Filter */}
          <select
            value={selectedSeguradora}
            onChange={(e) => setSelectedSeguradora(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="todas">Todas as Seguradoras</option>
            {availableSeguradoras.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Ramo Filter */}
          <select
            value={selectedRamo}
            onChange={(e) => setSelectedRamo(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="todos">Todos os Ramos</option>
            {availableRamos.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* New Quote Fast CTA */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all ml-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Cotação</span>
          </button>
        </div>

      </div>

      {/* 7 Columns Kanban Board */}
      <div className="overflow-x-auto pb-6">
        <div className="grid grid-cols-7 gap-3.5 min-w-[1380px]">
          {COLUMNS.map((col) => {
            const columnQuotes = filteredCotacoes.filter(c => c.status === col.id);
            const columnTotal = columnQuotes.reduce((sum, c) => sum + c.valorTotal, 0);
            const isDropTarget = draggedOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex flex-col bg-slate-100/75 rounded-2xl p-3 border min-h-[580px] transition-all duration-200 ${
                  isDropTarget 
                    ? 'border-orange-500 ring-2 ring-orange-400/40 bg-orange-50/30' 
                    : 'border-slate-200/80'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/90">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${col.badgeBg}`}>
                      {col.badgeText}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                      {columnQuotes.length}
                    </span>
                  </div>
                </div>

                {/* Subtotal of Column */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1 mb-3">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrencyBRL(columnTotal)}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[640px] pr-0.5">
                  {columnQuotes.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-3 text-center text-slate-400 text-xs">
                      <Layers className="w-5 h-5 text-slate-300 mb-1" />
                      <span>Arraste ou insira cotações aqui</span>
                    </div>
                  ) : (
                    columnQuotes.map((cotacao) => (
                      <KanbanCard
                        key={cotacao.id}
                        cotacao={cotacao}
                        allColumns={COLUMNS}
                        onSelect={onSelectCotacao}
                        onMoveStatus={onMoveStatus}
                        onRequestLoss={onRequestLoss}
                        onQuickWin={onQuickWin}
                        onDragStart={handleDragStart}
                      />
                    ))
                  )}
                </div>

                {/* Bottom Add shortcut in first column */}
                {col.id === 'nova' && (
                  <button
                    onClick={onOpenUpload}
                    className="w-full mt-3 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl transition-all shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                  </button>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
