import { apiClient } from './apiClient';
import { Reserved, UserRole } from '../types';

// Helper to convert MongoDB _id to id
const normalizeReserved = (item: any): Reserved => ({
  ...item,
  id: item._id || item.id,
});

export const reservedService = {
  async getReservedItems(user?: UserRole): Promise<Reserved[]> {
    const query = user ? `?user=${user}` : '';
    const items = await apiClient.get<Reserved[]>(`/reserved${query}`);
    return items.map(normalizeReserved);
  },

  async getReservedItem(id: string): Promise<Reserved> {
    const item = await apiClient.get<Reserved>(`/reserved/${id}`);
    return normalizeReserved(item);
  },

  async createReservedItem(data: {
    user: UserRole;
    purpose: string;
    amount: number;
    dueDate?: string;
  }): Promise<Reserved> {
    const item = await apiClient.post<Reserved>('/reserved', data);
    return normalizeReserved(item);
  },

  async updateReservedItem(id: string, data: {
    purpose?: string;
    amount?: number;
    dueDate?: string;
  }): Promise<Reserved> {
    const item = await apiClient.put<Reserved>(`/reserved/${id}`, data);
    return normalizeReserved(item);
  },

  async deleteReservedItem(id: string): Promise<void> {
    await apiClient.delete(`/reserved/${id}`);
  },

  async depositBack(id: string, amount: number): Promise<Reserved | null> {
    const result = await apiClient.patch<Reserved | { deleted: boolean }>(`/reserved/${id}/deposit`, { amount });
    
    // If full deposit, item is deleted
    if ('deleted' in result && result.deleted) {
      return null;
    }
    
    return normalizeReserved(result);
  },
};