import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { incomeService } from '../../services/incomeService';
import { Income } from '../../types';

interface IncomeState {
  incomes: Income[];
  loading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
  incomes: [],
  loading: false,
  error: null,
};

export const fetchIncomes = createAsyncThunk(
  'income/fetchIncomes',
  async (month?: string) => {
    return await incomeService.getIncomes(month);
  }
);

export const createIncome = createAsyncThunk(
  'income/createIncome',
  async (data: Omit<Income, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    return await incomeService.createIncome(data);
  }
);

export const updateIncome = createAsyncThunk(
  'income/updateIncome',
  async ({ id, data }: { id: string; data: Partial<Income> }) => {
    return await incomeService.updateIncome(id, data);
  }
);

export const deleteIncome = createAsyncThunk(
  'income/deleteIncome',
  async (id: string) => {
    await incomeService.deleteIncome(id);
    return id;
  }
);

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch incomes';
      })
      .addCase(createIncome.fulfilled, (state, action) => {
        state.incomes.push(action.payload);
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        const index = state.incomes.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.incomes[index] = action.payload;
        }
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.incomes = state.incomes.filter(i => i.id !== action.payload);
      });
  },
});

export const { clearError } = incomeSlice.actions;
export default incomeSlice.reducer;
