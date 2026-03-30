import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import api from '../utils/axiosInstance.js'

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null
}

// Action to init auth from token
export const initAuth = createAction('auth/init')

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/profile')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
    reducers: {
      login: (state) => {
        state.isLoggedIn = true
        state.loading = false
      },
      logout: (state) => {
        state.isLoggedIn = false
        state.user = null
        state.error = null
      },
      clearError: (state) => {
        state.error = null
      }
    },
  extraReducers: (builder) => {
    builder
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isLoggedIn = true
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isLoggedIn = false
      })
      // Init auth
      .addCase(initAuth, (state) => {
        const token = localStorage.getItem('token')
        state.isLoggedIn = !!token
        if (!token) {
          state.user = null
        }
      })
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer

