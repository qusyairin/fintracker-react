import { apiClient } from './apiClient';
import { CreditCard, CreditCardTransaction, CreditCardPayment, Installment, UserRole } from '../types';

// Normalize MongoDB _id to id
const normalizeCreditCard = (card: any): CreditCard => ({
  ...card,
  id: card._id || card.id,
});

const normalizeInstallment = (installment: any): Installment => ({
  ...installment,
  id: installment._id || installment.id,
});

export const creditCardService = {
  // Get all credit cards
  async getCreditCards(user?: UserRole): Promise<CreditCard[]> {
    const queryString = user ? `?user=${user}` : '';
    const cards = await apiClient.get<CreditCard[]>(`/credit-cards${queryString}`);
    return cards.map(normalizeCreditCard);
  },

  // Get single credit card
  async getCreditCard(id: string): Promise<CreditCard> {
    const card = await apiClient.get<CreditCard>(`/credit-cards/${id}`);
    return normalizeCreditCard(card);
  },

  // Update credit card details
  async updateCreditCard(
    id: string,
    data: {
      name?: string;
      bank?: string;
      creditLimit?: number;
    }
  ): Promise<CreditCard> {
    const card = await apiClient.put<CreditCard>(`/credit-cards/${id}`, data);
    return normalizeCreditCard(card);
  },

  // Update statement
  async updateStatement(
    id: string,
    data: {
      statementBalance: number;
      minimumPayment: number;
      statementDueDate: string;
    }
  ): Promise<CreditCard> {
    const card = await apiClient.patch<CreditCard>(`/credit-cards/${id}/statement`, data);
    return normalizeCreditCard(card);
  },

  // Make payment
  async makePayment(
    id: string,
    data: {
      amount: number;
      paidBy: UserRole;
      paymentDate?: string;
      notes?: string;
    }
  ): Promise<{ card: CreditCard; bill: any }> {
    const response = await apiClient.patch<{ card: CreditCard; bill: any }>(
      `/credit-cards/${id}/pay`,
      data
    );
    return {
      card: normalizeCreditCard(response.card),
      bill: response.bill,
    };
  },

  // Get payment history
  async getPaymentHistory(id: string): Promise<any[]> {
    return await apiClient.get<any[]>(`/credit-cards/${id}/payments`);
  },

  // Legacy methods (keep for backward compatibility)
  async getTransactions(): Promise<CreditCardTransaction[]> {
    return [];
  },

  async getPayments(): Promise<CreditCardPayment[]> {
    return [];
  },

  async addTransaction(data: Omit<CreditCardTransaction, 'id' | 'createdAt'>): Promise<CreditCardTransaction> {
    return await apiClient.post<CreditCardTransaction>('/credit-cards/transactions', data);
  },

  async addPayment(data: Omit<CreditCardPayment, 'id' | 'createdAt'>): Promise<CreditCardPayment> {
    return await apiClient.post<CreditCardPayment>('/credit-cards/payments', data);
  },

  // Installments
  async getInstallments(params?: {
    user?: UserRole;
    status?: 'active' | 'completed' | 'cancelled';
    cardType?: string;
  }): Promise<Installment[]> {
    const queryParams = new URLSearchParams();
    if (params?.user) queryParams.append('user', params.user);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.cardType) queryParams.append('cardType', params.cardType);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const installments = await apiClient.get<Installment[]>(`/installments${queryString}`);
    return installments.map(normalizeInstallment);
  },

  async getInstallment(id: string): Promise<Installment> {
    const installment = await apiClient.get<Installment>(`/installments/${id}`);
    return normalizeInstallment(installment);
  },

  async createInstallment(data: {
    creditCardId: string;
    cardType: string;
    user: UserRole;
    itemName: string;
    description?: string;
    totalAmount: number;
    monthlyInstallment: number;
    totalInstallments: number;
    interestRate?: number;
    startDate: string;
  }): Promise<Installment> {
    const installment = await apiClient.post<Installment>('/installments', data);
    return normalizeInstallment(installment);
  },

  async updateInstallment(
    id: string,
    data: {
      itemName?: string;
      description?: string;
      monthlyInstallment?: number;
      totalInstallments?: number;
      interestRate?: number;
    }
  ): Promise<Installment> {
    const installment = await apiClient.put<Installment>(`/installments/${id}`, data);
    return normalizeInstallment(installment);
  },

  async deleteInstallment(id: string): Promise<void> {
    await apiClient.delete(`/installments/${id}`);
  },

  async payInstallment(id: string): Promise<Installment> {
    const installment = await apiClient.patch<Installment>(`/installments/${id}/pay`);
    return normalizeInstallment(installment);
  },

  async cancelInstallment(id: string): Promise<Installment> {
    const installment = await apiClient.patch<Installment>(`/installments/${id}/cancel`);
    return normalizeInstallment(installment);
  },
};