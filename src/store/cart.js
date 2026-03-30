import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/axiosInstance.js'

const initialState = {
  cartBooks: [],
  cartCount: 0,
  status: 'idle',
  error: null
}

// Async thunk to fetch cart
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { getState, rejectWithValue }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return rejectWithValue('No token')
    }
    try {
      const response = await api.get('/cart/get-user-cart')
      return response.data.data || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cartCountUpdated: (state, action) => {
      state.cartCount = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.cartBooks = action.payload
        state.cartCount = action.payload.length
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
        state.cartCount = 0
      })
  }
})

export const { cartCountUpdated } = cartSlice.actions
export default cartSlice.reducer
