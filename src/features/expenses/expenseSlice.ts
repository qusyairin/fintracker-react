import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types';

interface ExpenseState {
  expenses: Expense[];
  pendingExpenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  pendingExpenses: [],
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (month?: string) => {
    return await expenseService.getExpenses(month);
  }
);

export const fetchPendingExpenses = createAsyncThunk(
  'expense/fetchPendingExpenses',
  async () => {
    return await expenseService.getPendingExpenses();
  }
);

export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    return await expenseService.createExpense(data);
  }
);

export const updateExpense = createAsyncThunk(
  'expense/updateExpense',
  async ({ id, data }: { id: string; data: Partial<Expense> }) => {
    return await expenseService.updateExpense(id, data);
  }
);

export const deleteExpense = createAsyncThunk(
  'expense/deleteExpense',
  async (id: string) => {
    await expenseService.deleteExpense(id);
    return id;
  }
);

export const approveExpense = createAsyncThunk(
  'expense/approveExpense',
  async (id: string) => {
    return await expenseService.approveExpense(id);
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(fetchPendingExpenses.fulfilled, (state, action) => {
        state.pendingExpenses = action.payload;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
        if (action.payload.status === 'pending') {
          state.pendingExpenses.push(action.payload);
        }
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
        state.pendingExpenses = state.pendingExpenses.filter(e => e.id !== action.payload);
      })
      .addCase(approveExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        state.pendingExpenses = state.pendingExpenses.filter(e => e.id !== action.payload.id);
      });
  },
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
