import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { creditCardService } from '../../services/creditCardService';
import { CreditCard, Installment, UserRole } from '../../types';

interface CreditCardState {
  cards: CreditCard[];
  installments: Installment[];
  loading: boolean;
  error: string | null;
}

const initialState: CreditCardState = {
  cards: [],
  installments: [],
  loading: false,
  error: null,
};

// Fetch all credit cards
export const fetchCreditCards = createAsyncThunk(
  'creditCard/fetchCards',
  async (user?: UserRole) => {
    return await creditCardService.getCreditCards(user);
  }
);

// Update credit card details
export const updateCreditCard = createAsyncThunk(
  'creditCard/updateCard',
  async ({ id, data }: { id: string; data: { name?: string; bank?: string; creditLimit?: number } }) => {
    return await creditCardService.updateCreditCard(id, data);
  }
);

// Update statement
export const updateStatement = createAsyncThunk(
  'creditCard/updateStatement',
  async ({
    id,
    data,
  }: {
    id: string;
    data: { statementBalance: number; minimumPayment: number; statementDueDate: string };
  }) => {
    return await creditCardService.updateStatement(id, data);
  }
);

// Make payment
export const makePayment = createAsyncThunk(
  'creditCard/makePayment',
  async ({
    id,
    data,
  }: {
    id: string;
    data: { amount: number; paidBy: UserRole; paymentDate?: string; notes?: string };
  }) => {
    return await creditCardService.makePayment(id, data);
  }
);

// Fetch installments
export const fetchInstallments = createAsyncThunk(
  'creditCard/fetchInstallments',
  async (params?: { user?: UserRole; status?: 'active' | 'completed' | 'cancelled' }) => {
    return await creditCardService.getInstallments(params);
  }
);

// Create installment
export const createInstallment = createAsyncThunk(
  'creditCard/createInstallment',
  async (data: {
    creditCardId: string;
    cardType: string;
    user: UserRole;
    itemName: string;
    description?: string;
    totalAmount: number;
    monthlyInstallment: number;
    totalInstallments: number;
    interestRate?: number;
    startDate: string;
  }) => {
    return await creditCardService.createInstallment(data);
  }
);

// Update installment
export const updateInstallment = createAsyncThunk(
  'creditCard/updateInstallment',
  async ({
    id,
    data,
  }: {
    id: string;
    data: {
      itemName?: string;
      description?: string;
      monthlyInstallment?: number;
      totalInstallments?: number;
      interestRate?: number;
    };
  }) => {
    return await creditCardService.updateInstallment(id, data);
  }
);

// Delete installment
export const deleteInstallment = createAsyncThunk(
  'creditCard/deleteInstallment',
  async (id: string) => {
    await creditCardService.deleteInstallment(id);
    return id;
  }
);

// Pay installment
export const payInstallment = createAsyncThunk(
  'creditCard/payInstallment',
  async (id: string) => {
    return await creditCardService.payInstallment(id);
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
      // Fetch credit cards
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
      // Update credit card
      .addCase(updateCreditCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      // Update statement
      .addCase(updateStatement.fulfilled, (state, action) => {
        const index = state.cards.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      // Make payment
      .addCase(makePayment.fulfilled, (state, action) => {
        const index = state.cards.findIndex((c) => c.id === action.payload.card.id);
        if (index !== -1) {
          state.cards[index] = action.payload.card;
        }
      })
      // Fetch installments
      .addCase(fetchInstallments.fulfilled, (state, action) => {
        state.installments = action.payload;
      })
      // Create installment
      .addCase(createInstallment.fulfilled, (state, action) => {
        state.installments.push(action.payload);
      })
      // Update installment
      .addCase(updateInstallment.fulfilled, (state, action) => {
        const index = state.installments.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.installments[index] = action.payload;
        }
      })
      // Delete installment
      .addCase(deleteInstallment.fulfilled, (state, action) => {
        state.installments = state.installments.filter((i) => i.id !== action.payload);
      })
      // Pay installment
      .addCase(payInstallment.fulfilled, (state, action) => {
        const index = state.installments.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.installments[index] = action.payload;
        }
      });
  },
});

export const { clearError } = creditCardSlice.actions;
export default creditCardSlice.reducer;