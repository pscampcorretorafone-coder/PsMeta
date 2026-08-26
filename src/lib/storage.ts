import { Cotacao, User } from '../types';
import { INITIAL_COTACOES, INITIAL_USERS } from '../mockData';
import { isSupabaseConfigured } from './supabase/client';
import {
  getCotacoesFromSupabase,
  saveCotacaoToSupabase,
  getUsersFromSupabase,
  saveUserToSupabase,
} from './supabase/services';

const COTACOES_STORAGE_KEY = 'segurflow_cotacoes_v1';
const USERS_STORAGE_KEY = 'segurflow_users_v1';
const ACTIVE_USER_STORAGE_KEY = 'segurflow_active_user_v1';

export function loadCotacoes(): Cotacao[] {
  try {
    const data = localStorage.getItem(COTACOES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(COTACOES_STORAGE_KEY, JSON.stringify(INITIAL_COTACOES));
      return INITIAL_COTACOES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading cotacoes from localStorage', e);
    return INITIAL_COTACOES;
  }
}

export function saveCotacoes(cotacoes: Cotacao[]): void {
  try {
    localStorage.setItem(COTACOES_STORAGE_KEY, JSON.stringify(cotacoes));
    // Asynchronous background sync with Supabase if configured
    if (isSupabaseConfigured()) {
      cotacoes.forEach(cotacao => {
        saveCotacaoToSupabase(cotacao).catch(err =>
          console.warn('Background Supabase sync error for quote:', cotacao.id, err)
        );
      });
    }
  } catch (e) {
    console.error('Error saving cotacoes to localStorage', e);
  }
}

export function loadUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading users from localStorage', e);
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    // Asynchronous background sync with Supabase if configured
    if (isSupabaseConfigured()) {
      users.forEach(user => {
        saveUserToSupabase(user).catch(err =>
          console.warn('Background Supabase sync error for user:', user.uid, err)
        );
      });
    }
  } catch (e) {
    console.error('Error saving users to localStorage', e);
  }
}

export function loadActiveUser(): User | null {
  try {
    const data = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const allUsers = loadUsers();
      const match = allUsers.find(u => u.uid === parsed.uid);
      if (match && match.ativo) return match;
    }
  } catch (e) {
    console.error('Error loading active user', e);
  }
  return null;
}

export function saveActiveUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error saving active user', e);
  }
}

export function resetToInitialData(): { cotacoes: Cotacao[]; users: User[] } {
  localStorage.setItem(COTACOES_STORAGE_KEY, JSON.stringify(INITIAL_COTACOES));
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(INITIAL_USERS[0]));
  return {
    cotacoes: INITIAL_COTACOES,
    users: INITIAL_USERS,
  };
}

/**
 * Hydrates state from Supabase if connected
 */
export async function syncFromSupabase(): Promise<{ cotacoes: Cotacao[]; users: User[] } | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const [remoteCotacoes, remoteUsers] = await Promise.all([
      getCotacoesFromSupabase(),
      getUsersFromSupabase(),
    ]);

    if (remoteCotacoes && remoteCotacoes.length > 0) {
      localStorage.setItem(COTACOES_STORAGE_KEY, JSON.stringify(remoteCotacoes));
    }
    if (remoteUsers && remoteUsers.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(remoteUsers));
    }

    return {
      cotacoes: remoteCotacoes || loadCotacoes(),
      users: remoteUsers || loadUsers(),
    };
  } catch (e) {
    console.error('Falha ao sincronizar com o Supabase:', e);
    return null;
  }
}
