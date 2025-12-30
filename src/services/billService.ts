import { apiClient } from './apiClient';
import { Bill, BillType } from '../types';

// Normalize MongoDB _id to id
const normalizeBill = (bill: any): Bill => ({
  ...bill,
  id: bill._id || bill.id,
});

export const billService = {
  // Get all bills
  async getBills(type?: BillType): Promise<Bill[]> {
    const queryString = type ? `?type=${type}` : '';
    const bills = await apiClient.get<Bill[]>(`/bills${queryString}`);
    return bills.map(normalizeBill);
  },

  // Get single bill
  async getBill(id: string): Promise<Bill> {
    const bill = await apiClient.get<Bill>(`/bills/${id}`);
    return normalizeBill(bill);
  },

  // Create bill
  async createBill(data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'isPaid'>): Promise<Bill> {
    const bill = await apiClient.post<Bill>('/bills', data);
    return normalizeBill(bill);
  },

  // Update bill
  async updateBill(id: string, data: Partial<Bill>): Promise<Bill> {
    const bill = await apiClient.put<Bill>(`/bills/${id}`, data);
    return normalizeBill(bill);
  },

  // Delete bill
  async deleteBill(id: string): Promise<void> {
    await apiClient.delete(`/bills/${id}`);
  },

  // Mark bill as paid
  async markBillAsPaid(
    id: string,
    data: {
      paymentMethod: string;
      category: string;
      addedBy: string;
    }
  ): Promise<Bill> {
    const bill = await apiClient.patch<Bill>(`/bills/${id}/mark-paid`, data);
    return normalizeBill(bill);
  },

  // Get upcoming bills
  async getUpcomingBills(days: number = 7): Promise<Bill[]> {
    const bills = await apiClient.get<Bill[]>(`/bills/upcoming?days=${days}`);
    return bills.map(normalizeBill);
  },
};