import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  Sparkles, 
  AlertCircle,
  Building2,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const adminUsers = users.filter(u => u.role === 'admin' && u.ativo);
  const vendorUsers = users.filter(u => u.role === 'vendedor' && u.ativo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail de acesso.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!matchedUser) {
        setErrorMessage('Usuário não encontrado. Verifique o e-mail digitado ou selecione um perfil de teste.');
        return;
      }

      if (!matchedUser.ativo) {
        setErrorMessage('Esta conta de usuário foi desativada pelo Administrador.');
        return;
      }

      onLogin(matchedUser);
    }, 400);
  };

  const handleQuickSelect = (user: User) => {
    setEmail(user.email);
    setPassword('••••••••');
    setErrorMessage('');
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/20 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            Segur<span className="text-orange-400 font-extrabold">Flow</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Gestão Comercial de Seguros & Extração de Cotações com IA
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-400" />
              Acesso ao Sistema
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Entre com as credenciais corporativas da corretora
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: diretoria@segurflow.com.br"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no SegurFlow</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Profiles Selector */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Acesso Rápido para Demonstração:
              </span>
            </div>

            {/* Admin Profile Quick Button */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-orange-400 uppercase">Perfil Administrador (Gestão Total):</span>
              {adminUsers.map(admin => (
                <button
                  key={admin.uid}
                  type="button"
                  onClick={() => handleQuickSelect(admin)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-950/30 border border-orange-800/40 hover:border-orange-500/60 hover:bg-orange-900/30 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={admin.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                      alt={admin.nome}
                      className="w-8 h-8 rounded-full object-cover border border-orange-400/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-orange-300 truncate">
                        {admin.nome}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {admin.cargo || 'Diretora Comercial'} • {admin.email}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-orange-500 text-white shrink-0 ml-2">
                    ADMIN
                  </span>
                </button>
              ))}
            </div>

            {/* Vendor Profiles Quick Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase">Perfis Vendedores (Carteira Própria):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {vendorUsers.slice(0, 2).map(vendor => (
                  <button
                    key={vendor.uid}
                    type="button"
                    onClick={() => handleQuickSelect(vendor)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/60 hover:bg-slate-800 text-left transition-all group cursor-pointer"
                  >
                    <img
                      src={vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={vendor.nome}
                      className="w-7 h-7 rounded-full object-cover border border-slate-600 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-white group-hover:text-blue-300 truncate">
                        {vendor.nome}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        Vendedor
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} SegurFlow • Sistema de Gestão Comercial e Extração de Apólices
        </p>

      </div>
    </div>
  );
};
