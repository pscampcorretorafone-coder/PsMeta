import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Cotacao, QuoteStatus, User } from './types';
import { loadCotacoes, saveCotacoes, loadUsers, saveUsers, loadActiveUser, saveActiveUser, resetToInitialData } from './lib/storage';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { AdminDashboard } from './components/AdminDashboard';
import { VendorManagement } from './components/VendorManagement';
import { EmailIntakeView } from './components/EmailIntakeModal';
import { UploadModal } from './components/UploadModal';
import { QuoteDetailModal } from './components/QuoteDetailModal';
import { LossReasonModal } from './components/LossReasonModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { formatCurrencyBRL } from './lib/formatters';

export default function App() {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>(() => loadCotacoes());
  const [users, setUsers] = useState<User[]>(() => loadUsers());
  const [activeUser, setActiveUser] = useState<User>(() => loadActiveUser());
  const [currentTab, setCurrentTab] = useState<'kanban' | 'dashboard' | 'vendedores' | 'email'>('kanban');
  
  // Modals & Selected items state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Cotacao | null>(null);
  const [lossQuote, setLossQuote] = useState<Cotacao | null>(null);
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>('todos');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to local storage
  useEffect(() => {
    saveCotacoes(cotacoes);
  }, [cotacoes]);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveActiveUser(activeUser);
  }, [activeUser]);

  // List of existing client names for autocomplete
  const existingClients = useMemo(() => {
    return Array.from(new Set(cotacoes.map(c => c.cliente))).filter(Boolean);
  }, [cotacoes]);

  // Switch User handler
  const handleSwitchUser = (newUser: User) => {
    setActiveUser(newUser);
    // If switching from admin to vendedor, reset vendor filter
    if (newUser.role === 'vendedor') {
      setSelectedVendorFilter(newUser.uid);
    } else {
      setSelectedVendorFilter('todos');
    }
    addToast({
      type: 'info',
      title: `Perfil alterado para ${newUser.nome}`,
      description: `Visualizando como ${newUser.role === 'admin' ? 'Administrador' : 'Vendedor'}`
    });
  };

  // Move status handler
  const handleMoveStatus = (cotacaoId: string, nextStatus: QuoteStatus) => {
    setCotacoes(prev =>
      prev.map(c => {
        if (c.id === cotacaoId) {
          const updated: Cotacao = {
            ...c,
            status: nextStatus,
            dataUltimaAtualizacao: new Date().toISOString(),
            historicoStatus: [
              ...c.historicoStatus,
              {
                status: nextStatus,
                data: new Date().toISOString(),
                usuarioNome: activeUser.nome,
                observacao: `Status alterado no Kanban para ${nextStatus.replace('_', ' ')}`
              }
            ]
          };
          return updated;
        }
        return c;
      })
    );

    const targetQuote = cotacoes.find(c => c.id === cotacaoId);
    if (targetQuote) {
      addToast({
        type: 'success',
        title: 'Status atualizado',
        description: `${targetQuote.cliente} movido para ${nextStatus.replace('_', ' ')}`
      });
    }
  };

  // Quick Win celebration handler
  const handleQuickWin = (cotacao: Cotacao) => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti animation error:', e);
    }

    setCotacoes(prev =>
      prev.map(c => {
        if (c.id === cotacao.id) {
          return {
            ...c,
            status: 'fechada' as QuoteStatus,
            dataUltimaAtualizacao: new Date().toISOString(),
            historicoStatus: [
              ...c.historicoStatus,
              {
                status: 'fechada',
                data: new Date().toISOString(),
                usuarioNome: activeUser.nome,
                observacao: '🎉 Negócio fechado com sucesso! Apólice emitida.'
              }
            ]
          };
        }
        return c;
      })
    );

    if (selectedQuote && selectedQuote.id === cotacao.id) {
      setSelectedQuote(prev => prev ? { ...prev, status: 'fechada' } : null);
    }

    addToast({
      type: 'success',
      title: '🎉 Negócio Fechado com Sucesso!',
      description: `Cotação de ${cotacao.cliente} (${formatCurrencyBRL(cotacao.valorTotal)}) contabilizada no faturamento!`
    });
  };

  // Request Loss Modal
  const handleRequestLoss = (cotacao: Cotacao) => {
    setLossQuote(cotacao);
  };

  // Confirm Loss with Reason
  const handleConfirmLoss = (cotacaoId: string, reason: string) => {
    setCotacoes(prev =>
      prev.map(c => {
        if (c.id === cotacaoId) {
          return {
            ...c,
            status: 'perdida' as QuoteStatus,
            motivoPerda: reason,
            dataUltimaAtualizacao: new Date().toISOString(),
            historicoStatus: [
              ...c.historicoStatus,
              {
                status: 'perdida',
                data: new Date().toISOString(),
                usuarioNome: activeUser.nome,
                observacao: `Perda registrada: ${reason}`
              }
            ]
          };
        }
        return c;
      })
    );

    if (selectedQuote && selectedQuote.id === cotacaoId) {
      setSelectedQuote(null);
    }

    addToast({
      type: 'warning',
      title: 'Cotação marcada como perdida',
      description: `Motivo registrado no histórico.`
    });
  };

  // Save new quote from PDF extraction or Email
  const handleSaveNewQuote = (quoteData: Partial<Cotacao>) => {
    const newId = `COT-${new Date().getFullYear()}-${String(cotacoes.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const assignedVendor = activeUser.role === 'vendedor' 
      ? activeUser 
      : users.find(u => u.role === 'vendedor') || activeUser;

    const newQuote: Cotacao = {
      id: newId,
      cliente: quoteData.cliente || 'Novo Cliente',
      clienteCnpj: quoteData.clienteCnpj,
      clienteEmail: quoteData.clienteEmail,
      clienteTelefone: quoteData.clienteTelefone,
      valorTotal: quoteData.valorTotal || 0,
      seguradora: quoteData.seguradora || 'Porto Seguro',
      produtos: quoteData.produtos || ['Seguro'],
      ramo: quoteData.ramo || 'Automóvel',
      status: 'nova',
      vendedorId: assignedVendor.uid,
      vendedorNome: assignedVendor.nome,
      origem: quoteData.origem || 'Upload PDF',
      pdfName: quoteData.pdfName || 'cotacao_seguro.pdf',
      dataCriacao: now,
      dataUltimaAtualizacao: now,
      observacoes: quoteData.observacoes || 'Importada via extração inteligente de PDF',
      historicoStatus: [
        {
          status: 'nova',
          data: now,
          usuarioNome: activeUser.nome,
          observacao: 'Cotação extraída e cadastrada no sistema'
        }
      ]
    };

    setCotacoes(prev => [newQuote, ...prev]);

    addToast({
      type: 'success',
      title: 'Cotação Cadastrada com Sucesso!',
      description: `${newQuote.cliente} (${formatCurrencyBRL(newQuote.valorTotal)}) adicionada à coluna Nova Cotação.`
    });
  };

  // Update existing quote details
  const handleUpdateQuote = (updated: Cotacao) => {
    setCotacoes(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedQuote(updated);
    addToast({
      type: 'success',
      title: 'Cotação atualizada',
      description: 'As alterações foram salvas com sucesso.'
    });
  };

  // Add new salesperson
  const handleAddUser = (newUser: Partial<User>) => {
    const newUid = `user_${Date.now()}`;
    const user: User = {
      uid: newUid,
      nome: newUser.nome || 'Novo Consultor',
      email: newUser.email || 'vendedor@corretora.com.br',
      telefone: newUser.telefone,
      role: 'vendedor',
      ativo: true,
      dataCriacao: new Date().toISOString(),
      metaFaturamento: newUser.metaFaturamento || 100000,
      metaVolume: newUser.metaVolume || 20,
      avatar: newUser.avatar
    };

    setUsers(prev => [...prev, user]);
    addToast({
      type: 'success',
      title: 'Vendedor Cadastrado!',
      description: `${user.nome} já pode acessar o sistema e gerenciar suas metas.`
    });
  };

  // Update salesperson
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.uid === updatedUser.uid ? updatedUser : u));
    if (activeUser.uid === updatedUser.uid) {
      setActiveUser(updatedUser);
    }
    addToast({
      type: 'success',
      title: 'Metas Atualizadas',
      description: `As metas de ${updatedUser.nome} foram salvas com sucesso.`
    });
  };

  // Send reminder alert to salesperson about stalled quote
  const handleSendReminder = (cotacao: Cotacao) => {
    addToast({
      type: 'info',
      title: 'Cobrança enviada ao consultor',
      description: `Notificação enviada para ${cotacao.vendedorNome} sobre a cotação ${cotacao.cliente}.`
    });
  };

  // Reset sample data
  const handleResetData = () => {
    const initial = resetToInitialData();
    setCotacoes(initial.cotacoes);
    setUsers(initial.users);
    setActiveUser(initial.users[0]);
    addToast({
      type: 'info',
      title: 'Dados restaurados',
      description: 'O sistema foi reinicializado com as cotações de demonstração.'
    });
  };

  // Navigate to vendor's Kanban from Admin
  const handleViewVendorKanban = (vendorId: string) => {
    setSelectedVendorFilter(vendorId);
    setCurrentTab('kanban');
    const v = users.find(u => u.uid === vendorId);
    if (v) {
      addToast({
        type: 'info',
        title: `Visualizando Kanban de ${v.nome}`,
        description: 'Filtro aplicado no quadro comercial.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col font-sans text-slate-800 selection:bg-orange-500 selection:text-white">
      
      {/* App Header Bar */}
      <Header
        activeUser={activeUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onResetData={handleResetData}
        quotesCount={cotacoes.length}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: KANBAN BOARD */}
        {currentTab === 'kanban' && (
          <KanbanBoard
            cotacoes={cotacoes}
            activeUser={activeUser}
            allUsers={users}
            onSelectCotacao={setSelectedQuote}
            onMoveStatus={handleMoveStatus}
            onRequestLoss={handleRequestLoss}
            onQuickWin={handleQuickWin}
            onOpenUpload={() => setIsUploadOpen(true)}
            selectedVendorFilter={selectedVendorFilter}
            onSelectVendorFilter={setSelectedVendorFilter}
          />
        )}

        {/* TAB 2: ADMIN DASHBOARD */}
        {currentTab === 'dashboard' && (
          <AdminDashboard
            cotacoes={cotacoes}
            users={users}
            onSelectCotacao={setSelectedQuote}
            onNavigateToVendorTab={() => setCurrentTab('vendedores')}
            onSendReminder={handleSendReminder}
          />
        )}

        {/* TAB 3: VENDOR MANAGEMENT */}
        {currentTab === 'vendedores' && (
          <VendorManagement
            users={users}
            cotacoes={cotacoes}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onViewVendorKanban={handleViewVendorKanban}
          />
        )}

        {/* TAB 4: EMAIL INGESTION VIEW */}
        {currentTab === 'email' && (
          <EmailIntakeView
            onIngestQuote={handleSaveNewQuote}
            activeUser={activeUser}
          />
        )}

      </main>

      {/* Upload & Gemini Extraction Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveQuote={handleSaveNewQuote}
        existingClients={existingClients}
        activeUser={activeUser}
      />

      {/* Quote Details & Timeline Modal */}
      <QuoteDetailModal
        cotacao={selectedQuote}
        onClose={() => setSelectedQuote(null)}
        onUpdateQuote={handleUpdateQuote}
        onRequestLoss={handleRequestLoss}
        onQuickWin={handleQuickWin}
        currentUser={activeUser}
      />

      {/* Loss Reason Modal */}
      <LossReasonModal
        cotacao={lossQuote}
        isOpen={!!lossQuote}
        onClose={() => setLossQuote(null)}
        onConfirmLoss={handleConfirmLoss}
      />

      {/* Global Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
}
