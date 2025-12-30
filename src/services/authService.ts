import { UserRole } from '../types';

interface LoginCredentials {
  passcode: string;
  role: UserRole; // Added role
  rememberMe: boolean;
}

interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
  token: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passcode: credentials.passcode,
          role: credentials.role,
          rememberMe: credentials.rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data if rememberMe is true
      if (credentials.rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
      } else {
        // Store in session storage for current session only
        sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
        sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage regardless of API call success
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(USER_DATA_KEY);
    }
  },

  async checkAuth(): Promise<LoginResponse | null> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY) || sessionStorage.getItem(USER_DATA_KEY);

    if (!token || !userData) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear storage
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(USER_DATA_KEY);
        return null;
      }

      const data = await response.json();

      return {
        success: true,
        user: data.user,
        token,
      };
    } catch (error) {
      // Network error or invalid token
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(USER_DATA_KEY);
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  },
};