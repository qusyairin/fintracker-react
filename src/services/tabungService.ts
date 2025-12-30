import { apiClient } from './apiClient';
import { Tabung, TabungTransaction, UserRole } from '../types';

// Normalize MongoDB _id to id
const normalizeTabung = (data: any): Tabung => ({
  ...data,
  id: data._id || data.id,
});

const normalizeTransaction = (data: any): TabungTransaction => ({
  ...data,
  id: data._id || data.id,
});

// Get all tabung
const getTabung = async (user?: UserRole, status?: 'active' | 'completed'): Promise<Tabung[]> => {
  const params = new URLSearchParams();
  if (user) params.append('user', user);
  if (status) params.append('status', status);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const tabungItems = await apiClient.get<Tabung[]>(`/tabung${queryString}`);
  return tabungItems.map(normalizeTabung);
};

// Get single tabung
const getTabungById = async (id: string): Promise<Tabung> => {
  const tabung = await apiClient.get<Tabung>(`/tabung/${id}`);
  return normalizeTabung(tabung);
};

// Create new tabung
const createTabung = async (data: {
  user: UserRole;
  name: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
}): Promise<Tabung> => {
  const tabung = await apiClient.post<Tabung>('/tabung', data);
  return normalizeTabung(tabung);
};

// Update tabung
const updateTabung = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    targetAmount?: number;
    targetDate?: string;
  }
): Promise<Tabung> => {
  const tabung = await apiClient.put<Tabung>(`/tabung/${id}`, data);
  return normalizeTabung(tabung);
};

// Delete tabung
const deleteTabung = async (id: string): Promise<void> => {
  await apiClient.delete(`/tabung/${id}`);
};

// Save money to tabung
const saveToTabung = async (
  id: string,
  data: {
    amount: number;
    reason?: string;
  }
): Promise<Tabung> => {
  const tabung = await apiClient.patch<Tabung>(`/tabung/${id}/save`, data);
  return normalizeTabung(tabung);
};

// Withdraw money from tabung
const withdrawFromTabung = async (
  id: string,
  data: {
    amount: number;
    reason?: string;
  }
): Promise<Tabung> => {
  const tabung = await apiClient.patch<Tabung>(`/tabung/${id}/withdraw`, data);
  return normalizeTabung(tabung);
};

// Get tabung transaction history
const getTabungTransactions = async (tabungId: string): Promise<TabungTransaction[]> => {
  const transactions = await apiClient.get<TabungTransaction[]>(`/tabung/${tabungId}/transactions`);
  return transactions.map(normalizeTransaction);
};

export const tabungService = {
  getTabung,
  getTabungById,
  createTabung,
  updateTabung,
  deleteTabung,
  saveToTabung,
  withdrawFromTabung,
  getTabungTransactions,
};