import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { billService } from '../../services/billService';
import { Bill } from '../../types';

interface BillState {
  bills: Bill[];
  upcomingBills: Bill[];
  loading: boolean;
  error: string | null;
}

const initialState: BillState = {
  bills: [],
  upcomingBills: [],
  loading: false,
  error: null,
};

export const fetchBills = createAsyncThunk('bill/fetchBills', async () => {
  return await billService.getBills();
});

export const fetchUpcomingBills = createAsyncThunk(
  'bill/fetchUpcomingBills',
  async (days: number = 7) => {
    return await billService.getUpcomingBills(days);
  }
);

export const createBill = createAsyncThunk(
  'bill/createBill',
  async (data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await billService.createBill(data);
  }
);

export const updateBill = createAsyncThunk(
  'bill/updateBill',
  async ({ id, data }: { id: string; data: Partial<Bill> }) => {
    return await billService.updateBill(id, data);
  }
);

export const markBillAsPaid = createAsyncThunk(
  'bill/markBillAsPaid',
  async ({ 
    id, 
    paymentMethod, 
    category, 
    addedBy 
  }: { 
    id: string; 
    paymentMethod: string; 
    category: string; 
    addedBy: string;
  }) => {
    return await billService.markBillAsPaid(id, {
      paymentMethod,
      category,
      addedBy,
    });
  }
);

export const deleteBill = createAsyncThunk('bill/deleteBill', async (id: string) => {
  await billService.deleteBill(id);
  return id;
});

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bills';
      })
      .addCase(fetchUpcomingBills.fulfilled, (state, action) => {
        state.upcomingBills = action.payload;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        const index = state.bills.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
      })
      .addCase(markBillAsPaid.fulfilled, (state, action) => {
        const index = state.bills.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
        state.upcomingBills = state.upcomingBills.filter(b => b.id !== action.payload.id);
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter(b => b.id !== action.payload);
        state.upcomingBills = state.upcomingBills.filter(b => b.id !== action.payload);
      });
  },
});

export const { clearError } = billSlice.actions;
export default billSlice.reducer;
