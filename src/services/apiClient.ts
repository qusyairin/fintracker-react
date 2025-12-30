import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = authService.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      // Backend returns { success, data }, we just want data
      return data.data as T;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data.data as T;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data.data as T;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data.data as T;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }

  async delete(endpoint: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const data: ApiResponse<any> = await response.json();
        throw new Error(data.error || data.message || 'Request failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  }
}

export const apiClient = new ApiClient();