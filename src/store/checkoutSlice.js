import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for submitting order
export const submitOrder = createAsyncThunk(
  'checkout/submitOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Simulate API call to submit order
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit order');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    shippingInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
    },
    orderSummary: {
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    },
    loading: false,
    error: null,
    orderSuccess: false,
    orderId: null,
  },
  reducers: {
    updateShippingInfo: (state, action) => {
      state.shippingInfo = { ...state.shippingInfo, ...action.payload };
    },
    updatePaymentInfo: (state, action) => {
      state.paymentInfo = { ...state.paymentInfo, ...action.payload };
    },
    updateOrderSummary: (state, action) => {
      state.orderSummary = { ...state.orderSummary, ...action.payload };
    },
    calculateOrderSummary: (state, action) => {
      const { subtotal } = action.payload;
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + shipping + tax;
      
      state.orderSummary = {
        subtotal,
        shipping,
        tax,
        total,
      };
    },
    clearCheckout: (state) => {
      state.shippingInfo = checkoutSlice.getInitialState().shippingInfo;
      state.paymentInfo = checkoutSlice.getInitialState().paymentInfo;
      state.orderSummary = checkoutSlice.getInitialState().orderSummary;
      state.loading = false;
      state.error = null;
      state.orderSuccess = false;
      state.orderId = null;
    },
    resetOrderStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.orderSuccess = false;
      state.orderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderSuccess = true;
        state.orderId = action.payload.id || Math.random().toString(36).substr(2, 9).toUpperCase();
        // Clear cart items after successful order
        state.shippingInfo = checkoutSlice.getInitialState().shippingInfo;
        state.paymentInfo = checkoutSlice.getInitialState().paymentInfo;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderSuccess = false;
      });
  },
});

export const {
  updateShippingInfo,
  updatePaymentInfo,
  updateOrderSummary,
  calculateOrderSummary,
  clearCheckout,
  resetOrderStatus,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;