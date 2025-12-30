import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import incomeReducer from '../features/income/incomeSlice';
import expenseReducer from '../features/expenses/expenseSlice';
import billReducer from '../features/bills/billSlice';
import budgetReducer from '../features/budget/budgetSlice';
import creditCardReducer from '../features/creditCards/creditCardSlice';
import balanceReducer from '../features/balance/balanceSlice';
import balanceHistoryReducer from '../features/balance/balanceHistorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    income: incomeReducer,
    expense: expenseReducer,
    bill: billReducer,
    budget: budgetReducer,
    creditCard: creditCardReducer,
    balance: balanceReducer,
    balanceHistory: balanceHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
