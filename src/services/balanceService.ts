import { apiClient } from './apiClient';
import { Balance, UserRole } from '../types';

// Helper to convert MongoDB _id to id
const normalizeBalance = (balance: any): Balance => ({
  ...balance,
  id: balance._id || balance.id,
});

export const balanceService = {
  async getBalances(): Promise<Balance[]> {
    const balances = await apiClient.get<Balance[]>('/balances');
    return balances.map(normalizeBalance);
  },

  async getBalanceByUser(user: UserRole): Promise<Balance | null> {
    try {
      const balance = await apiClient.get<Balance>(`/balances/${user}`);
      return normalizeBalance(balance);
    } catch (error) {
      return null;
    }
  },

  async updateBalance(user: UserRole, data: { cash?: number; bank?: number; setAside?: number; reason?: string }): Promise<Balance> {
    const balance = await apiClient.put<Balance>(`/balances/${user}`, data);
    return normalizeBalance(balance);
  },

  async adjustBalance(user: UserRole, amount: number, accountType: 'cash' | 'bank' | 'setAside', reason?: string): Promise<Balance> {
    const balance = await apiClient.patch<Balance>(`/balances/${user}/adjust`, {
      amount,
      accountType,
      reason,
    });
    return normalizeBalance(balance);
  },
};