import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { balanceService } from '../../services/balanceService';
import { Balance, UserRole } from '../../types';

interface BalanceState {
  balances: Balance[];
  loading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  balances: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchBalances = createAsyncThunk(
  'balance/fetchBalances',
  async () => {
    return await balanceService.getBalances();
  }
);

export const fetchBalanceByUser = createAsyncThunk(
  'balance/fetchBalanceByUser',
  async (user: UserRole) => {
    return await balanceService.getBalanceByUser(user);
  }
);

export const updateBalance = createAsyncThunk(
  'balance/updateBalance',
  async ({ user, data }: { user: UserRole; data: { cash?: number; bank?: number; setAside?: number; reason?: string } }) => {
    return await balanceService.updateBalance(user, data);
  }
);

export const adjustBalance = createAsyncThunk(
  'balance/adjustBalance',
  async ({ user, amount, accountType, reason }: { user: UserRole; amount: number; accountType: 'cash' | 'bank' | 'setAside'; reason?: string }) => {
    return await balanceService.adjustBalance(user, amount, accountType, reason);
  }
);

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    // Local update (optimistic) - for immediate UI feedback
    updateBalanceLocal: (
      state,
      action: PayloadAction<{ user: UserRole; data: Partial<Omit<Balance, 'user' | 'total' | 'openingBalance'>> }>
    ) => {
      const { user, data } = action.payload;
      const index = state.balances.findIndex((b) => b.user === user);
      
      if (index !== -1) {
        if (data.cash !== undefined) state.balances[index].cash = data.cash;
        if (data.bank !== undefined) state.balances[index].bank = data.bank;
        if (data.setAside !== undefined) state.balances[index].setAside = data.setAside;
        
        // Recalculate total
        state.balances[index].total =
          state.balances[index].cash +
          state.balances[index].bank +
          state.balances[index].setAside;
        
        state.balances[index].lastUpdated = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all balances
      .addCase(fetchBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.balances = action.payload;
      })
      .addCase(fetchBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch balances';
      })
      
      // Fetch balance by user
      .addCase(fetchBalanceByUser.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.balances.findIndex((b) => b.user === action.payload!.user);
          if (index !== -1) {
            state.balances[index] = action.payload;
          } else {
            state.balances.push(action.payload);
          }
        }
      })
      
      // Update balance
      .addCase(updateBalance.fulfilled, (state, action) => {
        const index = state.balances.findIndex((b) => b.user === action.payload.user);
        if (index !== -1) {
          state.balances[index] = action.payload;
        }
      })
      
      // Adjust balance
      .addCase(adjustBalance.fulfilled, (state, action) => {
        const index = state.balances.findIndex((b) => b.user === action.payload.user);
        if (index !== -1) {
          state.balances[index] = action.payload;
        }
      });
  },
});

export const { clearError, updateBalanceLocal } = balanceSlice.actions;
export default balanceSlice.reducer;