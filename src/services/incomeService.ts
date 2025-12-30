import { apiClient } from './apiClient';
import { Income } from '../types';
import { getFinancialMonthRange } from '../utils/dateUtils';

// Helper to convert MongoDB _id to id
const normalizeIncome = (income: any): Income => ({
  ...income,
  id: income._id || income.id,
});

export const incomeService = {
  async getIncomes(month?: string): Promise<Income[]> {
    let queryParam = '';
    
    if (month) {
      const { start, end } = getFinancialMonthRange(month);
      queryParam = `?startDate=${start}&endDate=${end}`;
    }
    
    const incomes = await apiClient.get<Income[]>(`/incomes${queryParam}`);
    return incomes.map(normalizeIncome);
  },

  async createIncome(data: Omit<Income, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Income> {
    const income = await apiClient.post<Income>('/incomes', data);
    return normalizeIncome(income);
  },

  async updateIncome(id: string, data: Partial<Income>): Promise<Income> {
    const income = await apiClient.put<Income>(`/incomes/${id}`, data);
    return normalizeIncome(income);
  },

  async deleteIncome(id: string): Promise<void> {
    await apiClient.delete(`/incomes/${id}`);
  },

  async approveIncome(id: string): Promise<Income> {
    const income = await apiClient.patch<Income>(`/incomes/${id}/approve`);
    return normalizeIncome(income);
  },
};