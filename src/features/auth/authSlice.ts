import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    role: UserRole;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isChecking: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isChecking: true,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { passcode: string; role: UserRole; rememberMe: boolean }) => {
    const response = await authService.login(credentials);
    return response;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const response = await authService.checkAuth();
  return response;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state) => {
      state.isChecking = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isChecking = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isChecking = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isChecking = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      });
  },
});

export const { clearError, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;