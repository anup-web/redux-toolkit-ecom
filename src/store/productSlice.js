import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching single product
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (productId) => {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const data = await response.json();
    return data;
  }
);

// Async thunk for fetching related products by category
export const fetchRelatedProducts = createAsyncThunk(
  'product/fetchRelatedProducts',
  async (category) => {
    const response = await fetch(`https://fakestoreapi.com/products/category/${category}?limit=4`);
    const data = await response.json();
    return data;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    product: null,
    relatedProducts: [],
    loading: false,
    error: null,
    relatedLoading: false,
    relatedError: null,
  },
  reducers: {
    clearProduct: (state) => {
      state.product = null;
      state.relatedProducts = [];
      state.error = null;
      state.relatedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.product = null;
      })
      // Fetch related products
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedLoading = true;
        state.relatedError = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedLoading = false;
        // Filter out the current product from related products
        state.relatedProducts = action.payload.filter(
          product => product.id !== state.product?.id
        ).slice(0, 4);
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedLoading = false;
        state.relatedError = action.error.message;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;