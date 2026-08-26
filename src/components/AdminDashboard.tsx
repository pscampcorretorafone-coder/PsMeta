import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  PieChart as PieIcon, 
  Users, 
  AlertTriangle, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Send,
  Building
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  CartesianGrid 
} from 'recharts';
import { Cotacao, User } from '../types';
import { formatCurrencyBRL, formatDateBR, getDaysSince } from '../lib/formatters';

interface AdminDashboardProps {
  cotacoes: Cotacao[];
  users: User[];
  onSelectCotacao: (cotacao: Cotacao) => void;
  onNavigateToVendorTab: () => void;
  onSendReminder: (cotacao: Cotacao) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cotacoes,
  users,
  onSelectCotacao,
  onNavigateToVendorTab,
  onSendReminder,
}) => {
  const vendedores = useMemo(() => users.filter(u => u.role === 'vendedor'), [users]);

  // Overall KPIs calculation
  const stats = useMemo(() => {
    const totalQuotes = cotacoes.length;
    const fechadas = cotacoes.filter(c => c.status === 'fechada');
    const perdidas = cotacoes.filter(c => c.status === 'perdida');
    const ativas = cotacoes.filter(c => c.status !== 'fechada' && c.status !== 'perdida');

    const totalFaturado = fechadas.reduce((sum, c) => sum + c.valorTotal, 0);
    const totalPipelineAtivo = ativas.reduce((sum, c) => sum + c.valorTotal, 0);

    const metaGlobalFaturamento = vendedores.reduce((sum, v) => sum + (v.metaFaturamento || 100000), 0);
    const metaGlobalVolume = vendedores.reduce((sum, v) => sum + (v.metaVolume || 20), 0);

    const taxaConversaoGlobal = totalQuotes > 0 ? Math.round((fechadas.length / totalQuotes) * 100) : 0;
    const ticketMedio = fechadas.length > 0 ? totalFaturado / fechadas.length : 0;
    const percentMetaFaturamento = metaGlobalFaturamento > 0 ? Math.round((totalFaturado / metaGlobalFaturamento) * 100) : 0;

    // Stalled quotes (> 3 days without update)
    const paradas = ativas.filter(c => getDaysSince(c.dataUltimaAtualizacao) >= 3);

    // High value open quotes (> R$ 20.000)
    const altoValor = ativas
      .filter(c => c.valorTotal >= 20000)
      .sort((a, b) => b.valorTotal - a.valorTotal);

    return {
      totalQuotes,
      fechadas,
      perdidas,
      ativas,
      totalFaturado,
      totalPipelineAtivo,
      metaGlobalFaturamento,
      metaGlobalVolume,
      taxaConversaoGlobal,
      ticketMedio,
      percentMetaFaturamento,
      paradas,
      altoValor
    };
  }, [cotacoes, vendedores]);

  // 1. Monthly Evolution Chart Data (Simulated history based on existing quotes)
  const monthlyEvolutionData = [
    { mes: 'Mar/26', criadas: 14, fechadas: 6, faturamento: 45000 },
    { mes: 'Abr/26', criadas: 18, fechadas: 9, faturamento: 68000 },
    { mes: 'Mai/26', criadas: 22, fechadas: 11, faturamento: 82000 },
    { mes: 'Jun/26', criadas: 26, fechadas: 14, faturamento: 110000 },
    { mes: 'Jul/26', criadas: 29, fechadas: 16, faturamento: 135000 },
    { mes: 'Ago/26 (Atual)', criadas: cotacoes.length, fechadas: stats.fechadas.length, faturamento: stats.totalFaturado },
  ];

  // 2. Status Distribution Pie Data
  const statusDistributionData = useMemo(() => {
    const countMap: Record<string, { name: string; count: number; color: string }> = {
      nova: { name: 'Nova', count: 0, color: '#3b82f6' },
      em_analise: { name: 'Em Análise', count: 0, color: '#f59e0b' },
      enviada: { name: 'Enviada', count: 0, color: '#6366f1' },
      aguardando: { name: 'Aguardando', count: 0, color: '#a855f7' },
      revisao: { name: 'Negociação', count: 0, color: '#ea580c' },
      fechada: { name: 'Fechada (Ganho)', count: 0, color: '#10b981' },
      perdida: { name: 'Perdida', count: 0, color: '#94a3b8' },
    };

    cotacoes.forEach(c => {
      if (countMap[c.status]) {
        countMap[c.status].count += 1;
      }
    });

    return Object.values(countMap).filter(item => item.count > 0);
  }, [cotacoes]);

  // 3. Ranking de Vendedores por Faturamento
  const vendorRankingData = useMemo(() => {
    return vendedores.map(v => {
      const vendorQuotes = cotacoes.filter(c => c.vendedorId === v.uid);
      const fechadas = vendorQuotes.filter(c => c.status === 'fechada');
      const faturado = fechadas.reduce((sum, c) => sum + c.valorTotal, 0);
      const totalVolume = vendorQuotes.length;
      const taxa = totalVolume > 0 ? Math.round((fechadas.length / totalVolume) * 100) : 0;

      return {
        nome: v.nome.split(' ')[0], // First name
        fullName: v.nome,
        faturado,
        meta: v.metaFaturamento,
        taxaConversao: taxa,
        fechadasCount: fechadas.length,
        totalQuotes: totalVolume
      };
    }).sort((a, b) => b.faturado - a.faturado);
  }, [vendedores, cotacoes]);

  // 4. Ramos mais Cotados / Vendidos
  const ramosDistributionData = useMemo(() => {
    const ramoMap: Record<string, { ramo: string; totalValor: number; count: number }> = {};
    
    cotacoes.forEach(c => {
      const ramoName = c.ramo || 'Outros';
      if (!ramoMap[ramoName]) {
        ramoMap[ramoName] = { ramo: ramoName, totalValor: 0, count: 0 };
      }
      ramoMap[ramoName].totalValor += c.valorTotal;
      ramoMap[ramoName].count += 1;
    });

    return Object.values(ramoMap).sort((a, b) => b.totalValor - a.totalValor);
  }, [cotacoes]);

  return (
    <div className="space-y-6">
      
      {/* Executive Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Diretoria Executiva
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Dados consolidados em tempo real
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1.5">
            Dashboard da Corretora de Seguros
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento de metas globais, produtividade dos consultores e integridade do pipeline.
          </p>
        </div>

        <button
          onClick={onNavigateToVendorTab}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <Users className="w-4 h-4 text-orange-400" />
          <span>Gerenciar Metas & Vendedores</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Faturamento do Mês */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Faturamento do Mês</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {formatCurrencyBRL(stats.totalFaturado)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Meta: {formatCurrencyBRL(stats.metaGlobalFaturamento)}
            </span>
            <span className="font-bold text-emerald-600">
              {stats.percentMetaFaturamento}% atingido
            </span>
          </div>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Taxa de Conversão</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <PieIcon className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats.taxaConversaoGlobal}%
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              {stats.fechadas.length} fechadas de {stats.totalQuotes}
            </span>
            <span className="font-bold text-indigo-600">
              {stats.perdidas.length} perdidas
            </span>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Ticket Médio por Apólice</span>
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {formatCurrencyBRL(stats.ticketMedio)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Média das cotações convertidas</span>
            <span className="text-orange-600 font-bold">Excelente</span>
          </div>
        </div>

        {/* Pipeline Ativo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pipeline Aberto</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {formatCurrencyBRL(stats.totalPipelineAtivo)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>{stats.ativas.length} propostas em negociação</span>
            <span className="text-blue-600 font-bold">Ativo</span>
          </div>
        </div>

      </div>

      {/* Smart Operational Alerts Banner */}
      {stats.paradas.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-amber-950">
                Alerta de Estagnação: {stats.paradas.length} cotações sem atualização há mais de 3 dias
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Risco de perda para a concorrência. Cobre retorno dos consultores responsáveis.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-3 py-1.5 rounded-lg whitespace-nowrap">
            {formatCurrencyBRL(stats.paradas.reduce((s, c) => s + c.valorTotal, 0))} em risco
          </span>
        </div>
      )}

      {/* Charts Grid Row 1: Evolução Mensal & Distribuição por Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Evolução Mensal (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Evolução Mensal: Cotações Criadas vs Fechadas
              </h3>
              <p className="text-xs text-slate-500">
                Volume de negócios gerados e convertidos nos últimos 6 meses
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEvolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCriadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFechadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    name === 'faturamento' ? formatCurrencyBRL(value) : value,
                    name === 'criadas' ? 'Criadas' : name === 'fechadas' ? 'Fechadas (Ganho)' : 'Faturamento'
                  ]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="criadas" name="Criadas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCriadas)" />
                <Area type="monotone" dataKey="fechadas" name="Fechadas (Ganho)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFechadas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Status (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Distribuição por Etapa do Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Proporção de cotações por estágio
            </p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} cotações`, name]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
            {statusDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Charts Grid Row 2: Ranking de Vendedores & Ramos Mais Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ranking de Vendedores */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Ranking de Vendedores por Faturamento
              </h3>
              <p className="text-xs text-slate-500">
                Faturamento fechado vs Meta estipulada
              </p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorRankingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="nome" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `R$ ${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [formatCurrencyBRL(value), name === 'faturado' ? 'Faturamento Fechado' : 'Meta']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="faturado" name="Fechado (R$)" fill="#059669" radius={[6, 6, 0, 0]} />
                <Bar dataKey="meta" name="Meta (R$)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ramos mais Vendidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Distribuição por Ramo de Seguro
              </h3>
              <p className="text-xs text-slate-500">
                Volume financeiro gerado por segmento
              </p>
            </div>
            <Building className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical"
                data={ramosDistributionData.slice(0, 5)} 
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `R$ ${val / 1000}k`}
                />
                <YAxis 
                  type="category"
                  dataKey="ramo" 
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} 
                  axisLine={false} 
                  tickLine={false}
                  width={90}
                />
                <Tooltip 
                  formatter={(value: any) => [formatCurrencyBRL(value), 'Volume Total']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="totalValor" name="Total R$" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Operational Tables: 1. Cotações de Alto Valor & 2. Cotações Paradas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cotações de Alto Valor em Aberto */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Cotações de Alto Valor em Aberto
                </h3>
                <p className="text-xs text-slate-500">
                  Oportunidades estratégicas no pipeline
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                {stats.altoValor.length} cotações
              </span>
            </div>

            <div className="space-y-2.5">
              {stats.altoValor.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Nenhuma cotação de alto valor em aberto no momento.
                </p>
              ) : (
                stats.altoValor.slice(0, 4).map(cot => (
                  <div
                    key={cot.id}
                    onClick={() => onSelectCotacao(cot)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 border border-slate-200/80 hover:border-orange-200 transition-all cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {cot.cliente}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {cot.seguradora} • Consultor: <span className="font-medium text-slate-700">{cot.vendedorNome}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-extrabold text-slate-900">
                        {formatCurrencyBRL(cot.valorTotal)}
                      </p>
                      <span className="text-[10px] font-semibold text-orange-600 uppercase">
                        {cot.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cotações Paradas há mais de 3 dias */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Cotações Paradas (Cobrança)
                </h3>
                <p className="text-xs text-slate-500">
                  Sem movimentação de status há mais de 3 dias
                </p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-md">
                {stats.paradas.length} paradas
              </span>
            </div>

            <div className="space-y-2.5">
              {stats.paradas.length === 0 ? (
                <p className="text-xs text-emerald-600 text-center py-6 font-medium">
                  Excelente! Todas as cotações ativas foram movimentadas recentemente.
                </p>
              ) : (
                stats.paradas.slice(0, 4).map(cot => (
                  <div
                    key={cot.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200/80"
                  >
                    <div>
                      <h4 
                        onClick={() => onSelectCotacao(cot)}
                        className="text-xs font-bold text-slate-900 hover:text-orange-600 cursor-pointer"
                      >
                        {cot.cliente}
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        {getDaysSince(cot.dataUltimaAtualizacao)} dias sem contato • Vendedor: {cot.vendedorNome}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-900">
                          {formatCurrencyBRL(cot.valorTotal)}
                        </p>
                      </div>
                      <button
                        onClick={() => onSendReminder(cot)}
                        title="Enviar cobrança ao vendedor"
                        className="p-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[10px]">Cobrar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
