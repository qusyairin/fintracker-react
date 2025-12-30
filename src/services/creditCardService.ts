import { apiClient } from './apiClient';
import {
  CreditCard,
  CreditCardTransaction,
  CreditCardPayment,
  Installment,
  CreditCardType,
} from '../types';

// Helpers to convert MongoDB _id to id
const normalizeCard = (card: any): CreditCard => ({
  ...card,
  id: card._id || card.id,
});

const normalizeTransaction = (transaction: any): CreditCardTransaction => ({
  ...transaction,
  id: transaction._id || transaction.id,
});

const normalizePayment = (payment: any): CreditCardPayment => ({
  ...payment,
  id: payment._id || payment.id,
});

const normalizeInstallment = (installment: any): Installment => ({
  ...installment,
  id: installment._id || installment.id,
});

export const creditCardService = {
  async getCreditCards(): Promise<CreditCard[]> {
    const cards = await apiClient.get<CreditCard[]>('/credit-cards');
    return cards.map(normalizeCard);
  },

  async getCreditCardById(id: string): Promise<CreditCard | null> {
    try {
      const card = await apiClient.get<CreditCard>(`/credit-cards/${id}`);
      return normalizeCard(card);
    } catch (error) {
      return null;
    }
  },

  async updateCreditCard(id: string, data: Partial<CreditCard>): Promise<CreditCard> {
    const card = await apiClient.put<CreditCard>(`/credit-cards/${id}`, data);
    return normalizeCard(card);
  },

  async addTransaction(data: Omit<CreditCardTransaction, 'id' | 'createdAt'>): Promise<CreditCardTransaction> {
    const transaction = await apiClient.post<CreditCardTransaction>('/credit-cards/transactions', data);
    return normalizeTransaction(transaction);
  },

  async getTransactions(cardType?: CreditCardType): Promise<CreditCardTransaction[]> {
    const queryParam = cardType ? `?cardType=${cardType}` : '';
    const transactions = await apiClient.get<CreditCardTransaction[]>(`/credit-cards/transactions${queryParam}`);
    return transactions.map(normalizeTransaction);
  },

  async addPayment(data: Omit<CreditCardPayment, 'id' | 'createdAt'>): Promise<CreditCardPayment> {
    const payment = await apiClient.post<CreditCardPayment>('/credit-cards/payments', data);
    return normalizePayment(payment);
  },

  async getPayments(cardType?: CreditCardType): Promise<CreditCardPayment[]> {
    const queryParam = cardType ? `?cardType=${cardType}` : '';
    const payments = await apiClient.get<CreditCardPayment[]>(`/credit-cards/payments${queryParam}`);
    return payments.map(normalizePayment);
  },

  async getInstallments(cardType?: CreditCardType): Promise<Installment[]> {
    const queryParam = cardType ? `?cardType=${cardType}` : '';
    const installments = await apiClient.get<Installment[]>(`/credit-cards/installments${queryParam}`);
    return installments.map(normalizeInstallment);
  },

  async addInstallment(data: Omit<Installment, 'id'>): Promise<Installment> {
    const installment = await apiClient.post<Installment>('/credit-cards/installments', data);
    return normalizeInstallment(installment);
  },
};