import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { creditCardService } from '../../services/creditCardService';
import { CreditCard, CreditCardTransaction, CreditCardPayment, Installment } from '../../types';

interface CreditCardState {
  cards: CreditCard[];
  transactions: CreditCardTransaction[];
  payments: CreditCardPayment[];
  installments: Installment[];
  loading: boolean;
  error: string | null;
}

const initialState: CreditCardState = {
  cards: [],
  transactions: [],
  payments: [],
  installments: [],
  loading: false,
  error: null,
};

export const fetchCreditCards = createAsyncThunk('creditCard/fetchCards', async () => {
  return await creditCardService.getCreditCards();
});

export const fetchTransactions = createAsyncThunk('creditCard/fetchTransactions', async () => {
  return await creditCardService.getTransactions();
});

export const fetchPayments = createAsyncThunk('creditCard/fetchPayments', async () => {
  return await creditCardService.getPayments();
});

export const fetchInstallments = createAsyncThunk('creditCard/fetchInstallments', async () => {
  return await creditCardService.getInstallments();
});

export const addTransaction = createAsyncThunk(
  'creditCard/addTransaction',
  async (data: Omit<CreditCardTransaction, 'id' | 'createdAt'>) => {
    return await creditCardService.addTransaction(data);
  }
);

export const addPayment = createAsyncThunk(
  'creditCard/addPayment',
  async (data: Omit<CreditCardPayment, 'id' | 'createdAt'>) => {
    return await creditCardService.addPayment(data);
  }
);

const creditCardSlice = createSlice({
  name: 'creditCard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCreditCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCreditCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch credit cards';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      })
      .addCase(fetchInstallments.fulfilled, (state, action) => {
        state.installments = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        const cardIndex = state.cards.findIndex(c => c.type === action.payload.cardType);
        if (cardIndex !== -1) {
          state.cards[cardIndex].outstandingBalance += action.payload.amount;
        }
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload);
        const cardIndex = state.cards.findIndex(c => c.type === action.payload.cardType);
        if (cardIndex !== -1) {
          state.cards[cardIndex].outstandingBalance -= action.payload.amount;
          if (state.cards[cardIndex].outstandingBalance < 0) {
            state.cards[cardIndex].outstandingBalance = 0;
          }
        }
      });
  },
});

export const { clearError } = creditCardSlice.actions;
export default creditCardSlice.reducer;
