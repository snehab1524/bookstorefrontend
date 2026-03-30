import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { dummyBooks } from '../data/books';
import { dummyOrders } from '../data/orders';
import { dummyUsers } from '../data/users';
import { dummyCategories } from '../data/categories';
import { dummyReviews } from '../data/reviews';

const AdminContext = createContext();

const initialState = {
  books: dummyBooks,
  orders: dummyOrders,
  users: dummyUsers,
  categories: dummyCategories,
  reviews: dummyReviews,
  stats: {
    totalBooks: dummyBooks.length,
    totalUsers: dummyUsers.length,
    totalOrders: dummyOrders.length,
    totalRevenue: dummyOrders.reduce((sum, order) => sum + order.total, 0)
  },
  darkMode: false,
  showModal: false,
  selectedItem: null,
  loading: false,
  searchTerm: '',
  filters: {}
};

function adminReducer(state, action) {
  switch (action.type) {
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'UPDATE_BOOKS':
      return { ...state, books: action.payload, stats: { ...state.stats, totalBooks: action.payload.length } };
    case 'UPDATE_BOOK_STOCK':
      return {
        ...state,
        books: state.books.map(b => b.id === action.payload.id ? { ...b, stock: action.payload.stock } : b),
        stats: { ...state.stats }
      };
    case 'ADD_BOOK':
      return { 
        ...state, 
        books: [action.payload, ...state.books],
        stats: { ...state.stats, totalBooks: state.stats.totalBooks + 1 }
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(b => b.id !== action.payload),
        stats: { ...state.stats, totalBooks: state.stats.totalBooks - 1 }
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order
        )
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload, showModal: !!action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, showModal: !state.showModal };
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload };
    default:
      return state;
  }
}

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    // Recalc revenue
    const revenue = state.orders.reduce((sum, order) => sum + order.total, 0);
    dispatch({ type: 'UPDATE_STATS', payload: { ...state.stats, totalRevenue: revenue } });
  }, [state.orders]);

  const value = {
    state,
    dispatch
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

