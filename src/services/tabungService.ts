import axios from 'axios';
import { Tabung, TabungTransaction, UserRole } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  // Check both localStorage and sessionStorage (matches authService pattern)
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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

  const response = await axios.get(
    `${API_URL}/tabung?${params.toString()}`,
    getAuthHeader()
  );
  return response.data.data.map(normalizeTabung);
};

// Get single tabung
const getTabungById = async (id: string): Promise<Tabung> => {
  const response = await axios.get(`${API_URL}/tabung/${id}`, getAuthHeader());
  return normalizeTabung(response.data.data);
};

// Create new tabung
const createTabung = async (data: {
  user: UserRole;
  name: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
}): Promise<Tabung> => {
  const response = await axios.post(`${API_URL}/tabung`, data, getAuthHeader());
  return normalizeTabung(response.data.data);
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
  const response = await axios.put(`${API_URL}/tabung/${id}`, data, getAuthHeader());
  return normalizeTabung(response.data.data);
};

// Delete tabung
const deleteTabung = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/tabung/${id}`, getAuthHeader());
};

// Save money to tabung
const saveToTabung = async (
  id: string,
  data: {
    amount: number;
    reason?: string;
  }
): Promise<Tabung> => {
  const response = await axios.patch(
    `${API_URL}/tabung/${id}/save`,
    data,
    getAuthHeader()
  );
  return normalizeTabung(response.data.data);
};

// Withdraw money from tabung
const withdrawFromTabung = async (
  id: string,
  data: {
    amount: number;
    reason?: string;
  }
): Promise<Tabung> => {
  const response = await axios.patch(
    `${API_URL}/tabung/${id}/withdraw`,
    data,
    getAuthHeader()
  );
  return normalizeTabung(response.data.data);
};

// Get tabung transaction history
const getTabungTransactions = async (tabungId: string): Promise<TabungTransaction[]> => {
  const response = await axios.get(
    `${API_URL}/tabung/${tabungId}/transactions`,
    getAuthHeader()
  );
  return response.data.data.map(normalizeTransaction);
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