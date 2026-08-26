import React, { useState } from 'react';
import { 
  Shield, 
  FileUp, 
  LayoutDashboard, 
  Kanban, 
  Users, 
  Mail, 
  ChevronDown, 
  Check, 
  RotateCcw,
  Bot,
  Database,
  LogOut
} from 'lucide-react';
import { User } from '../types';
import { isSupabaseConfigured } from '../lib/supabase/client';
import { DatabaseStatusModal } from './DatabaseStatusModal';

interface HeaderProps {
  activeUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  onLogout: () => void;
  currentTab: 'kanban' | 'dashboard' | 'vendedores' | 'email';
  onChangeTab: (tab: 'kanban' | 'dashboard' | 'vendedores' | 'email') => void;
  onOpenUpload: () => void;
  onResetData: () => void;
  quotesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  allUsers,
  onSwitchUser,
  onLogout,
  currentTab,
  onChangeTab,
  onOpenUpload,
  onResetData,
  quotesCount,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const isSupabaseLive = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-40 bg-[#101b42] border-b border-indigo-900/60 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  Segur<span className="text-orange-400">Flow</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-200 border border-indigo-700/50">
                  <Bot className="w-3 h-3 text-orange-400" />
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Gestão & Extração Inteligente de Cotações
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-indigo-900/50">
            <button
              onClick={() => onChangeTab('kanban')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'kanban'
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Quadro Kanban</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/25 font-bold">
                {quotesCount}
              </span>
            </button>

            <button
              onClick={() => onChangeTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard Admin</span>
            </button>

            <button
              onClick={() => onChangeTab('vendedores')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'vendedores'
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Gestão de Vendedores</span>
            </button>

            <button
              onClick={() => onChangeTab('email')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'email'
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-mail Inbox IA</span>
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Database status button */}
            <button
              onClick={() => setDbModalOpen(true)}
              title={isSupabaseLive ? "Supabase Conectado" : "Supabase: Modo Local (Clique para instruções)"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isSupabaseLive
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseLive ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden lg:inline text-[11px]">
                {isSupabaseLive ? 'Supabase' : 'DB Local'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* New Quote Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Cotação (PDF IA)</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Role & User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-indigo-800/60 text-xs text-left transition-all cursor-pointer"
              >
                <img
                  src={activeUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={activeUser.nome}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-orange-500/50"
                />
                <div className="hidden sm:block">
                  <p className="font-semibold text-white leading-none text-xs">
                    {activeUser.nome}
                  </p>
                  <p className="text-[10px] text-orange-400 capitalize font-medium mt-0.5">
                    {activeUser.role === 'admin' ? 'Administrador' : 'Vendedor'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 text-slate-200">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Alternar Usuário / Perfil
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Alterne entre Vendedor (Kanban próprio) ou Administrador (Visão geral)
                      </p>
                    </div>

                    <div className="py-1 space-y-1">
                      {allUsers.map((user) => {
                        const isSelected = user.uid === activeUser.uid;
                        return (
                          <button
                            key={user.uid}
                            onClick={() => {
                              onSwitchUser(user);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                              isSelected
                                ? 'bg-orange-600/20 text-orange-400 font-semibold border border-orange-500/30'
                                : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={user.avatar}
                                alt={user.nome}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-white text-xs leading-none">
                                  {user.nome}
                                </p>
                                <span className={`inline-block text-[10px] mt-0.5 px-1.5 py-0.2 rounded font-semibold ${
                                  user.role === 'admin' 
                                    ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' 
                                    : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                                }`}>
                                  {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-orange-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-1 border-t border-slate-800 px-2 space-y-1">
                      <button
                        onClick={() => {
                          onResetData();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-1.5 text-[11px] text-slate-400 hover:text-rose-300 hover:bg-slate-800/80 rounded transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restaurar dados de exemplo</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 p-1.5 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sair / Trocar de Conta</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-indigo-900/40 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => onChangeTab('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'kanban' ? 'bg-orange-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban ({quotesCount})</span>
          </button>
          <button
            onClick={() => onChangeTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-orange-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onChangeTab('vendedores')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'vendedores' ? 'bg-orange-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Vendedores</span>
          </button>
          <button
            onClick={() => onChangeTab('email')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'email' ? 'bg-orange-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>E-mail</span>
          </button>
        </div>

      </div>

      {/* Supabase Database Status and Setup Modal */}
      <DatabaseStatusModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
      />
    </header>
  );
};
