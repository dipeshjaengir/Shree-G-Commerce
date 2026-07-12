import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService.js';

// Helper to calculate totals locally
const calculateCartTotals = (items) => {
  let subtotal = 0;
  let mrpTotal = 0;
  
  items.forEach(item => {
    if (item.product) {
      subtotal += item.product.price * item.quantity;
      mrpTotal += item.product.mrp * item.quantity;
    }
  });

  const discountAmount = mrpTotal - subtotal;
  const freeDeliveryLimit = 500;
  const deliveryCharge = 40;
  const shippingFee = subtotal >= freeDeliveryLimit || subtotal === 0 ? 0 : deliveryCharge;
  const totalAmount = subtotal + shippingFee;

  return {
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount
  };
};

// 1. ASYNC THUNKS
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data.cart.items;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      return response.data.cart.items;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(productId);
      return response.data.cart.items;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  }
);

// 2. SLICE
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discountAmount = 0;
      state.shippingFee = 0;
      state.totalAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        Object.assign(state, calculateCartTotals(state.items));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD TO CART
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        Object.assign(state, calculateCartTotals(state.items));
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE FROM CART
      .addCase(removeFromCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        Object.assign(state, calculateCartTotals(state.items));
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
