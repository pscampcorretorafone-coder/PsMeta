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
  Check,
  ShieldCheck,
  UserX,
  Lock
} from 'lucide-react';
import { User, Cotacao } from '../types';
import { formatCurrencyBRL, formatPhoneBR } from '../lib/formatters';

interface VendorManagementProps {
  users: User[];
  cotacoes: Cotacao[];
  currentUser: User;
  onAddUser: (newUser: Partial<User>) => void;
  onUpdateUser: (updatedUser: User) => void;
  onViewVendorKanban: (vendorId: string) => void;
}

export const VendorManagement: React.FC<VendorManagementProps> = ({
  users,
  cotacoes,
  currentUser,
  onAddUser,
  onUpdateUser,
  onViewVendorKanban,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New Vendor Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'vendedor' | 'admin'>('vendedor');
  const [newCargo, setNewCargo] = useState('Consultor Comercial');
  const [newPhone, setNewPhone] = useState('');
  const [newMetaFaturamento, setNewMetaFaturamento] = useState(100000);
  const [newMetaVolume, setNewMetaVolume] = useState(20);

  // Edit Goals State
  const [editNome, setEditNome] = useState('');
  const [editCargo, setEditCargo] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editMetaFaturamento, setEditMetaFaturamento] = useState(100000);
  const [editMetaVolume, setEditMetaVolume] = useState(20);
  const [editAtivo, setEditAtivo] = useState(true);

  const vendedores = users.filter(u => u.role === 'vendedor');
  const admins = users.filter(u => u.role === 'admin');

  const handleCreateVendor = () => {
    if (!newName.trim() || !newEmail.trim()) {
      alert('Preencha o nome e e-mail do usuário.');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      alert('Este e-mail já está cadastrado no sistema.');
      return;
    }

    onAddUser({
      nome: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      cargo: newCargo.trim() || (newRole === 'admin' ? 'Administrador' : 'Consultor Comercial'),
      telefone: newPhone.trim() || '(11) 98888-0000',
      ativo: true,
      criadoPor: currentUser.nome,
      metaFaturamento: Number(newMetaFaturamento) || (newRole === 'admin' ? 300000 : 100000),
      metaVolume: Number(newMetaVolume) || (newRole === 'admin' ? 50 : 20),
      avatar: newRole === 'admin'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 1000000)}?w=150&auto=format&fit=crop&q=80`
    });

    setNewName('');
    setNewEmail('');
    setNewCargo('Consultor Comercial');
    setNewPhone('');
    setNewRole('vendedor');
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditNome(user.nome);
    setEditCargo(user.cargo || '');
    setEditTelefone(user.telefone || '');
    setEditMetaFaturamento(user.metaFaturamento || 100000);
    setEditMetaVolume(user.metaVolume || 20);
    setEditAtivo(user.ativo);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    onUpdateUser({
      ...editingUser,
      nome: editNome.trim() || editingUser.nome,
      cargo: editCargo.trim() || editingUser.cargo,
      telefone: editTelefone.trim() || editingUser.telefone,
      ativo: editAtivo,
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
              Painel do Administrador
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Gestão de Vendedores & Acessos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre novos corretores/vendedores, configure metas individuais de faturamento e volume, e gerencie permissões de acesso.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Usuário / Vendedor</span>
        </button>
      </div>

      {/* Overview Stats for Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total de Vendedores</p>
            <p className="text-lg font-black text-slate-900">{vendedores.length} consultores ativos</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Meta Global de Vendas</p>
            <p className="text-lg font-black text-slate-900">
              {formatCurrencyBRL(vendedores.reduce((sum, v) => sum + (v.metaFaturamento || 0), 0))}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Administradores</p>
            <p className="text-lg font-black text-slate-900">{admins.length} gestores</p>
          </div>
        </div>
      </div>

      {/* Section: Vendedores */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-600" />
          Equipe de Vendas ({vendedores.length})
        </h3>

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
                className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between hover:border-orange-300 transition-all ${
                  !vendedor.ativo ? 'opacity-60 border-slate-300 bg-slate-50' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* User Info Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={vendedor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={vendedor.nome}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500/20"
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${vendedor.ativo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">
                            {vendedor.nome}
                          </h4>
                          {!vendedor.ativo && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold">
                              Inativo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-orange-600 font-medium">
                          {vendedor.cargo || 'Consultor Comercial'}
                        </p>
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
                      title="Editar vendedor e metas"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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
      </div>

      {/* Modal: Add New User / Vendor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-500 text-white rounded-lg">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Cadastrar Novo Usuário
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Criado por {currentUser.nome} (Admin)
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
              
              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Perfil *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewRole('vendedor');
                      setNewCargo('Consultor Comercial');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newRole === 'vendedor'
                        ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Vendedor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewRole('admin');
                      setNewCargo('Diretor Comercial');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newRole === 'admin'
                        ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Administrador</span>
                  </button>
                </div>
              </div>

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
                  E-mail Corporativo de Acesso *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="fernando@corretoraflow.com.br"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cargo / Especialidade
                  </label>
                  <input
                    type="text"
                    value={newCargo}
                    onChange={(e) => setNewCargo(e.target.value)}
                    placeholder="Consultor Sênior"
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
              </div>

              {/* Metas */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Metas Mensais Individuais:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Meta Faturamento (R$)
                    </label>
                    <input
                      type="number"
                      value={newMetaFaturamento}
                      onChange={(e) => setNewMetaFaturamento(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Meta Volume (Apólices)
                    </label>
                    <input
                      type="number"
                      value={newMetaVolume}
                      onChange={(e) => setNewMetaVolume(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateVendor}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Cadastrar Usuário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit User & Goals */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Editar Cadastro de {editingUser.nome}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingUser.role === 'admin' ? 'Perfil Administrador' : 'Perfil Vendedor'}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cargo / Especialidade
                  </label>
                  <input
                    type="text"
                    value={editCargo}
                    onChange={(e) => setEditCargo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={editTelefone}
                    onChange={(e) => setEditTelefone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Metas Mensais:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Meta Faturamento (R$)
                    </label>
                    <input
                      type="number"
                      value={editMetaFaturamento}
                      onChange={(e) => setEditMetaFaturamento(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Meta Volume (Apólices)
                    </label>
                    <input
                      type="number"
                      value={editMetaVolume}
                      onChange={(e) => setEditMetaVolume(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Ativo / Inativo Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editAtivo}
                    onChange={(e) => setEditAtivo(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Conta de Usuário Ativa (Permite login e atribuição de cotações)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setEditingUser(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
