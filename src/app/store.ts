import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import incomeReducer from '../features/income/incomeSlice';
import expenseReducer from '../features/expenses/expenseSlice';
import billReducer from '../features/bills/billSlice';
import budgetReducer from '../features/budget/budgetSlice';
import creditCardReducer from '../features/creditCards/creditCardSlice';
import balanceReducer from '../features/balance/balanceSlice';
import balanceHistoryReducer from '../features/balance/balanceHistorySlice';
import reservedReducer from '../features/reserved/reservedSlice';
import tabungReducer from '../features/tabung/tabungSlice';

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
    reserved: reservedReducer,
    tabung: tabungReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
