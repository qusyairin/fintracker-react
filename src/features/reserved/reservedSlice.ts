import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservedService } from '../../services/reservedService';
import { Reserved, UserRole } from '../../types';

interface ReservedState {
  items: Reserved[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservedState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchReservedItems = createAsyncThunk(
  'reserved/fetchItems',
  async (user?: UserRole) => {
    return await reservedService.getReservedItems(user);
  }
);

export const createReservedItem = createAsyncThunk(
  'reserved/createItem',
  async (data: {
    user: UserRole;
    purpose: string;
    amount: number;
    dueDate?: string;
  }) => {
    return await reservedService.createReservedItem(data);
  }
);

export const updateReservedItem = createAsyncThunk(
  'reserved/updateItem',
  async ({ id, data }: {
    id: string;
    data: {
      purpose?: string;
      amount?: number;
      dueDate?: string;
    };
  }) => {
    return await reservedService.updateReservedItem(id, data);
  }
);

export const deleteReservedItem = createAsyncThunk(
  'reserved/deleteItem',
  async (id: string) => {
    await reservedService.deleteReservedItem(id);
    return id;
  }
);

export const depositBack = createAsyncThunk(
  'reserved/depositBack',
  async ({ id, amount }: { id: string; amount: number }) => {
    const result = await reservedService.depositBack(id, amount);
    return { id, result };
  }
);

const reservedSlice = createSlice({
  name: 'reserved',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchReservedItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservedItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReservedItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reserved items';
      })
      // Create item
      .addCase(createReservedItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update item
      .addCase(updateReservedItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete item
      .addCase(deleteReservedItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      // Deposit back
      .addCase(depositBack.fulfilled, (state, action) => {
        if (action.payload.result === null) {
          // Full deposit - item deleted
          state.items = state.items.filter(i => i.id !== action.payload.id);
        } else {
          // Partial deposit - update item
          const index = state.items.findIndex(i => i.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload.result;
          }
        }
      });
  },
});

export const { clearError } = reservedSlice.actions;
export default reservedSlice.reducer;