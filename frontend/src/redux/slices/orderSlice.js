import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService.js';
import { clearCartLocal } from './cartSlice.js';

// 1. ASYNC THUNKS
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ addressId, paymentMethod }, { dispatch, rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(addressId, paymentMethod);
      dispatch(clearCartLocal()); // Clear cart state on successful order
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async ({ page, limit } = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(page, limit);
      return response.data; // { orders, pagination }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderDetails(orderId);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order details');
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

// 2. INITIAL STATE
const initialState = {
  orders: [],
  currentOrder: null,
  pagination: null,
  loading: false,
  error: null
};

// 3. SLICE
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // PLACE ORDER
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload); // Add new order to top of list
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH MY ORDERS
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.pagination = action.pagination || null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH DETAILS
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CANCEL ORDER
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        // Update item in orders list
        state.orders = state.orders.map(o => o._id === action.payload._id ? action.payload : o);
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
