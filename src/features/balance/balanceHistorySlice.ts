import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { balanceHistoryService } from '../../services/balanceHistoryService';
import { BalanceHistory, UserRole } from '../../types';

interface BalanceHistoryState {
  history: BalanceHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: BalanceHistoryState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchBalanceHistory = createAsyncThunk(
  'balanceHistory/fetchHistory',
  async (user?: UserRole) => {
    return await balanceHistoryService.getBalanceHistory(user);
  }
);

export const addBalanceHistory = createAsyncThunk(
  'balanceHistory/addHistory',
  async (data: Omit<BalanceHistory, 'id' | 'timestamp'>) => {
    return await balanceHistoryService.addBalanceHistory(data);
  }
);

const balanceHistorySlice = createSlice({
  name: 'balanceHistory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceHistory.fulfilled, (state, action: PayloadAction<BalanceHistory[]>) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchBalanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch balance history';
      })
      .addCase(addBalanceHistory.fulfilled, (state, action: PayloadAction<BalanceHistory>) => {
        state.history.unshift(action.payload);
      });
  },
});

export const { clearError } = balanceHistorySlice.actions;
export default balanceHistorySlice.reducer;