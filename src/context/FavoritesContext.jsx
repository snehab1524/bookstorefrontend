import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FAVORITES_ACTIONS = {
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
  SET_FAVORITES: 'SET_FAVORITES'
};

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case FAVORITES_ACTIONS.SET_FAVORITES:
      return action.payload;
    case FAVORITES_ACTIONS.ADD_FAVORITE:
      if (state.some(book => book._id === action.payload._id)) {
        return state; // Already exists
      }
      return [...state, action.payload];
    case FAVORITES_ACTIONS.REMOVE_FAVORITE:
      return state.filter(book => book._id !== action.payload);
    case FAVORITES_ACTIONS.CLEAR_FAVORITES:
      return [];
    default:
      return state;
  }
};

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, dispatch] = useReducer(favoritesReducer, [], (initial) => {
    try {
      const saved = localStorage.getItem('favoritesBooks');
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('favoritesBooks', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = (book) => {
    dispatch({ type: FAVORITES_ACTIONS.ADD_FAVORITE, payload: book });
  };

  const removeFavorite = (id) => {
    dispatch({ type: FAVORITES_ACTIONS.REMOVE_FAVORITE, payload: id });
  };

  const clearFavorites = () => {
    dispatch({ type: FAVORITES_ACTIONS.CLEAR_FAVORITES });
  };

  const isFavorite = (id) => {
    return favorites.some(book => book._id === id);
  };

  const toggleFavorite = (book) => {
    if (isFavorite(book._id)) {
      removeFavorite(book._id);
    } else {
      addFavorite(book);
    }
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    toggleFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
