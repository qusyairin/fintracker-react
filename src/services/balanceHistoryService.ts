import { apiClient } from './apiClient';
import { BalanceHistory, UserRole } from '../types';

// Helper to convert MongoDB _id to id
const normalizeHistory = (history: any): BalanceHistory => ({
  ...history,
  id: history._id || history.id,
});

export const balanceHistoryService = {
  async getBalanceHistory(user?: UserRole): Promise<BalanceHistory[]> {
    const queryParam = user ? `?user=${user}` : '';
    const history = await apiClient.get<BalanceHistory[]>(`/balances/history${queryParam}`);
    return history.map(normalizeHistory);
  },

  async addBalanceHistory(data: Omit<BalanceHistory, 'id' | 'timestamp'>): Promise<BalanceHistory> {
    const history = await apiClient.post<BalanceHistory>('/balances/history', data);
    return normalizeHistory(history);
  },

  async clearHistory(): Promise<void> {
    // Note: Backend doesn't have a clear endpoint yet
    // You might want to add DELETE /api/balances/history endpoint in backend
    console.warn('Clear history endpoint not implemented in backend');
  },
};