import { Cotacao, User } from '../types';
import { INITIAL_COTACOES, INITIAL_USERS } from '../mockData';

const COTAZOES_STORAGE_KEY = 'segurflow_cotacoes_v1';
const USERS_STORAGE_KEY = 'segurflow_users_v1';
const ACTIVE_USER_STORAGE_KEY = 'segurflow_active_user_v1';

export function loadCotacoes(): Cotacao[] {
  try {
    const data = localStorage.getItem(COTAZOES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(COTAZOES_STORAGE_KEY, JSON.stringify(INITIAL_COTACOES));
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
    localStorage.setItem(COTAZOES_STORAGE_KEY, JSON.stringify(cotacoes));
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
  } catch (e) {
    console.error('Error saving users to localStorage', e);
  }
}

export function loadActiveUser(): User {
  try {
    const data = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const allUsers = loadUsers();
      const match = allUsers.find(u => u.uid === parsed.uid);
      if (match) return match;
    }
  } catch (e) {
    console.error('Error loading active user', e);
  }
  // Default to Carlos Mendes (Vendedor)
  return INITIAL_USERS[0];
}

export function saveActiveUser(user: User): void {
  try {
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving active user', e);
  }
}

export function resetToInitialData(): { cotacoes: Cotacao[]; users: User[] } {
  localStorage.setItem(COTAZOES_STORAGE_KEY, JSON.stringify(INITIAL_COTACOES));
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(INITIAL_USERS[0]));
  return {
    cotacoes: INITIAL_COTACOES,
    users: INITIAL_USERS,
  };
}
