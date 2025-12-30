import { apiClient } from './apiClient';
import { Bill } from '../types';

// Helper to convert MongoDB _id to id
const normalizeBill = (bill: any): Bill => ({
  ...bill,
  id: bill._id || bill.id,
});

export const billService = {
  async getBills(): Promise<Bill[]> {
    const bills = await apiClient.get<Bill[]>('/bills');
    return bills.map(normalizeBill);
  },

  async getUpcomingBills(days: number = 7): Promise<Bill[]> {
    const bills = await apiClient.get<Bill[]>(`/bills/upcoming?days=${days}`);
    return bills.map(normalizeBill);
  },

  async createBill(data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> {
    const bill = await apiClient.post<Bill>('/bills', data);
    return normalizeBill(bill);
  },

  async updateBill(id: string, data: Partial<Bill>): Promise<Bill> {
    const bill = await apiClient.put<Bill>(`/bills/${id}`, data);
    return normalizeBill(bill);
  },

  async markAsPaid(id: string, paymentMethod: string, category: string, addedBy: string): Promise<Bill> {
    const bill = await apiClient.patch<Bill>(`/bills/${id}/mark-paid`, {
      paymentMethod,
      category,
      addedBy,
    });
    return normalizeBill(bill);
  },

  async deleteBill(id: string): Promise<void> {
    await apiClient.delete(`/bills/${id}`);
  },
};