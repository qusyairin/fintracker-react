import { apiClient } from './apiClient';
import { Expense } from '../types';
import { getFinancialMonthRange } from '../utils/dateUtils';

// Helper to convert MongoDB _id to id
const normalizeExpense = (expense: any): Expense => ({
  ...expense,
  id: expense._id || expense.id,
});

export const expenseService = {
async getExpenses(month?: string): Promise<Expense[]> {
    let queryParam = '';
    
    if (month) {
      const { start, end } = getFinancialMonthRange(month);
      queryParam = `?startDate=${start}&endDate=${end}`;
    }
    
    const expenses = await apiClient.get<Expense[]>(`/expenses${queryParam}`);
    return expenses.map(normalizeExpense);
  },

  async getExpenseById(id: string): Promise<Expense | null> {
    try {
      const expense = await apiClient.get<Expense>(`/expenses/${id}`);
      return normalizeExpense(expense);
    } catch (error) {
      return null;
    }
  },

  async createExpense(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Expense> {
    const expense = await apiClient.post<Expense>('/expenses', data);
    return normalizeExpense(expense);
  },

  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    const expense = await apiClient.put<Expense>(`/expenses/${id}`, data);
    return normalizeExpense(expense);
  },

  async deleteExpense(id: string): Promise<void> {
    await apiClient.delete(`/expenses/${id}`);
  },

  async approveExpense(id: string): Promise<Expense> {
    const expense = await apiClient.patch<Expense>(`/expenses/${id}/approve`);
    return normalizeExpense(expense);
  },

  async rejectExpense(id: string, reason?: string): Promise<Expense> {
    const expense = await apiClient.patch<Expense>(`/expenses/${id}/reject`, { reason });
    return normalizeExpense(expense);
  },

  async getPendingExpenses(): Promise<Expense[]> {
    const expenses = await apiClient.get<Expense[]>('/expenses/pending');
    return expenses.map(normalizeExpense);
  },
};