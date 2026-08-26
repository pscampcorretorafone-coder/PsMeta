import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Edit, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Kanban,
  Award,
  Sparkles,
  X,
  Save,
  Check
} from 'lucide-react';
import { User, Cotacao } from '../types';
import { formatCurrencyBRL, formatPhoneBR } from '../lib/formatters';

interface VendorManagementProps {
  users: User[];
  cotacoes: Cotacao[];
  onAddUser: (newUser: Partial<User>) => void;
  onUpdateUser: (updatedUser: User) => void;
  onViewVendorKanban: (vendorId: string) => void;
}

export const VendorManagement: React.FC<VendorManagementProps> = ({
  users,
  cotacoes,
  onAddUser,
  onUpdateUser,
  onViewVendorKanban,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New Vendor Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newMetaFaturamento, setNewMetaFaturamento] = useState(100000);
  const [newMetaVolume, setNewMetaVolume] = useState(20);

  // Edit Goals State
  const [editMetaFaturamento, setEditMetaFaturamento] = useState(100000);
  const [editMetaVolume, setEditMetaVolume] = useState(20);

  const vendedores = users.filter(u => u.role === 'vendedor');

  const handleCreateVendor = () => {
    if (!newName.trim() || !newEmail.trim()) {
      alert('Preencha o nome e e-mail do vendedor.');
      return;
    }

    onAddUser({
      nome: newName.trim(),
      email: newEmail.trim(),
      telefone: newPhone.trim() || '(11) 98888-0000',
      role: 'vendedor',
      metaFaturamento: Number(newMetaFaturamento) || 100000,
      metaVolume: Number(newMetaVolume) || 20,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random()*1000000)}?w=150&auto=format&fit=crop&q=80`
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditMetaFaturamento(user.metaFaturamento || 100000);
    setEditMetaVolume(user.metaVolume || 20);
  };

  const handleSaveGoals = () => {
    if (!editingUser) return;
    onUpdateUser({
      ...editingUser,
      metaFaturamento: Number(editMetaFaturamento),
      metaVolume: Number(editMetaVolume),
    });
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              Gestão da Equipe Comercial
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Vendedores & Metas Mensais
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure metas de faturamento e volume, monitore o progresso individual e gerencie a equipe.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Vendedor</span>
        </button>
      </div>

      {/* Vendedores Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendedores.map((vendedor) => {
          const vendorQuotes = cotacoes.filter(c => c.vendedorId === vendedor.uid);
          const fechadas = vendorQuotes.filter(c => c.status === 'fechada');
          const faturado = fechadas.reduce((s, c) => s + c.valorTotal, 0);
          const metaFat = vendedor.metaFaturamento || 100000;
          const metaVol = vendedor.metaVolume || 20;

          const pctFat = metaFat > 0 ? Math.min(Math.round((faturado / metaFat) * 100), 100) : 0;
          const pctVol = metaVol > 0 ? Math.min(Math.round((fechadas.length / metaVol) * 100), 100) : 0;
          const taxaConv = vendorQuotes.length > 0 ? Math.round((fechadas.length / vendorQuotes.length) * 100) : 0;

          return (
            <div
              key={vendedor.uid}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all"
            >
              <div>
                {/* User Info Bar */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={vendedor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={vendedor.nome}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500/20"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {vendedor.nome}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {vendedor.email}
                      </p>
                      {vendedor.telefone && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {formatPhoneBR(vendedor.telefone)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(vendedor)}
                    title="Editar metas"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                {/* Performance Bars */}
                <div className="space-y-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                  {/* Faturamento */}
                  <div>
                    <div className="flex items-center justify-between text-slate-600 mb-1">
                      <span className="font-semibold flex items-center gap-1 text-[11px]">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        Faturamento:
                      </span>
                      <span className="font-bold text-emerald-700">
                        {pctFat}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{formatCurrencyBRL(faturado)}</span>
                      <span className="text-slate-400">Meta: {formatCurrencyBRL(metaFat)}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${pctFat}%` }}
                      />
                    </div>
                  </div>

                  {/* Volume de Cotações */}
                  <div>
                    <div className="flex items-center justify-between text-slate-600 mb-1">
                      <span className="font-semibold flex items-center gap-1 text-[11px]">
                        <Target className="w-3.5 h-3.5 text-blue-600" />
                        Volume de Apólices:
                      </span>
                      <span className="font-bold text-blue-700">
                        {pctVol}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{fechadas.length} fechadas</span>
                      <span className="text-slate-400">Meta: {metaVol}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${pctVol}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Conversion & Open stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Taxa Conversão</span>
                    <span className="font-extrabold text-purple-700 text-sm">{taxaConv}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Em Aberto</span>
                    <span className="font-extrabold text-orange-700 text-sm">
                      {vendorQuotes.filter(c => c.status !== 'fechada' && c.status !== 'perdida').length} cotações
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: View this vendor's Kanban */}
              <button
                onClick={() => onViewVendorKanban(vendedor.uid)}
                className="w-full mt-4 py-2 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Ver Quadro Kanban de {vendedor.nome.split(' ')[0]}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal: Add New Vendor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-500 text-white rounded-lg">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Cadastrar Novo Vendedor / Consultor
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Fernando Almeida"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail de Acesso *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="fernando@corretoraflow.com.br"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(11) 99999-8888"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Faturamento (R$)
                  </label>
                  <input
                    type="number"
                    value={newMetaFaturamento}
                    onChange={(e) => setNewMetaFaturamento(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Volume (Cotações)
                  </label>
                  <input
                    type="number"
                    value={newMetaVolume}
                    onChange={(e) => setNewMetaVolume(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateVendor}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Salvar e Criar Vendedor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Goals */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Editar Metas de {editingUser.nome}
                </h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meta Mensal de Faturamento (R$)
                </label>
                <input
                  type="number"
                  value={editMetaFaturamento}
                  onChange={(e) => setEditMetaFaturamento(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meta Mensal de Volume (Apólices Convertidas)
                </label>
                <input
                  type="number"
                  value={editMetaVolume}
                  onChange={(e) => setEditMetaVolume(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGoals}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Atualizar Metas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
