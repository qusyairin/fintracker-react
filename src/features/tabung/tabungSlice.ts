import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tabungService } from '../../services/tabungService';
import { Tabung, TabungTransaction, UserRole } from '../../types';

interface TabungState {
  items: Tabung[];
  transactions: Record<string, TabungTransaction[]>; // tabungId -> transactions
  loading: boolean;
  error: string | null;
}

const initialState: TabungState = {
  items: [],
  transactions: {},
  loading: false,
  error: null,
};

// ============ ASYNC THUNKS ============

export const fetchTabung = createAsyncThunk(
  'tabung/fetchTabung',
  async (params?: { user?: UserRole; status?: 'active' | 'completed' }) => {
    return await tabungService.getTabung(params?.user, params?.status);
  }
);

export const fetchTabungById = createAsyncThunk(
  'tabung/fetchTabungById',
  async (id: string) => {
    return await tabungService.getTabungById(id);
  }
);

export const createTabung = createAsyncThunk(
  'tabung/createTabung',
  async (data: {
    user: UserRole;
    name: string;
    description?: string;
    targetAmount: number;
    targetDate?: string;
  }) => {
    return await tabungService.createTabung(data);
  }
);

export const updateTabung = createAsyncThunk(
  'tabung/updateTabung',
  async ({
    id,
    data,
  }: {
    id: string;
    data: {
      name?: string;
      description?: string;
      targetAmount?: number;
      targetDate?: string;
    };
  }) => {
    return await tabungService.updateTabung(id, data);
  }
);

export const deleteTabung = createAsyncThunk(
  'tabung/deleteTabung',
  async (id: string) => {
    await tabungService.deleteTabung(id);
    return id;
  }
);

export const saveToTabung = createAsyncThunk(
  'tabung/saveToTabung',
  async ({ id, amount, reason }: { id: string; amount: number; reason?: string }) => {
    return await tabungService.saveToTabung(id, { amount, reason });
  }
);

export const withdrawFromTabung = createAsyncThunk(
  'tabung/withdrawFromTabung',
  async ({ id, amount, reason }: { id: string; amount: number; reason?: string }) => {
    return await tabungService.withdrawFromTabung(id, { amount, reason });
  }
);

export const fetchTabungTransactions = createAsyncThunk(
  'tabung/fetchTabungTransactions',
  async (tabungId: string) => {
    const transactions = await tabungService.getTabungTransactions(tabungId);
    return { tabungId, transactions };
  }
);

// ============ SLICE ============

const tabungSlice = createSlice({
  name: 'tabung',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tabung
      .addCase(fetchTabung.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTabung.fulfilled, (state, action: PayloadAction<Tabung[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTabung.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tabung';
      })

      // Fetch single tabung
      .addCase(fetchTabungById.fulfilled, (state, action: PayloadAction<Tabung>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })

      // Create tabung
      .addCase(createTabung.fulfilled, (state, action: PayloadAction<Tabung>) => {
        state.items.unshift(action.payload);
      })

      // Update tabung
      .addCase(updateTabung.fulfilled, (state, action: PayloadAction<Tabung>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete tabung
      .addCase(deleteTabung.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        delete state.transactions[action.payload];
      })

      // Save to tabung
      .addCase(saveToTabung.fulfilled, (state, action: PayloadAction<Tabung>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Withdraw from tabung
      .addCase(withdrawFromTabung.fulfilled, (state, action: PayloadAction<Tabung>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Fetch transactions
      .addCase(
        fetchTabungTransactions.fulfilled,
        (state, action: PayloadAction<{ tabungId: string; transactions: TabungTransaction[] }>) => {
          state.transactions[action.payload.tabungId] = action.payload.transactions;
        }
      );
  },
});

export const { clearError } = tabungSlice.actions;
export default tabungSlice.reducer;