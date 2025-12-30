import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Budget, ExpenseCategory } from '../../types';
import { getCurrentMonth } from '../../utils/dateUtils';

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [
    {
      id: '1',
      month: getCurrentMonth(),
      category: 'groceries',
      plannedAmount: 1500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      month: getCurrentMonth(),
      category: 'dining_out',
      plannedAmount: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      month: getCurrentMonth(),
      category: 'fuel',
      plannedAmount: 400,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setBudget: (
      state,
      action: PayloadAction<{ month: string; category: ExpenseCategory; amount: number }>
    ) => {
      const existing = state.budgets.find(
        b => b.month === action.payload.month && b.category === action.payload.category
      );
      if (existing) {
        existing.plannedAmount = action.payload.amount;
        existing.updatedAt = new Date().toISOString();
      } else {
        state.budgets.push({
          id: Date.now().toString(),
          month: action.payload.month,
          category: action.payload.category,
          plannedAmount: action.payload.amount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setBudget, clearError } = budgetSlice.actions;
export default budgetSlice.reducer;
